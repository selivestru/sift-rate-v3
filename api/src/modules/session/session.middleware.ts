import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import RedisStore from 'connect-redis'
import type { CookieOptions, RequestHandler } from 'express'
import session from 'express-session'
import { EnvConfig } from '~/app/config/env.config'
import { REDIS_KEYS } from '~/common/constants/redis-keys'
import { RedisService } from '~/infrastructure/redis/redis.service'

export const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000
export const SESSION_TTL_SECONDS = SESSION_MAX_AGE_MS / 1000

@Injectable()
export class SessionMiddlewareService {
  private readonly logger = new Logger(SessionMiddlewareService.name)
  private readonly middleware: RequestHandler[]
  private readonly cookieName: string
  private readonly cookieOptions: CookieOptions
  private readonly sessionPrefix: string

  constructor(redis: RedisService, config: ConfigService<EnvConfig, true>) {
    const isProd = config.get('NODE_ENV', { infer: true }) === 'production'

    this.cookieName = isProd ? '__Host-sid' : 'sid'
    this.sessionPrefix = config.get('SESSION_PREFIX', { infer: true })
    this.cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
    }

    const sessionHandler = session({
      store: new RedisStore({
        client: redis,
        prefix: this.sessionPrefix,
      }),
      name: this.cookieName,
      secret: config.get('SESSION_SECRET', { infer: true }),
      resave: false,
      rolling: true,
      saveUninitialized: false,
      cookie: {
        ...this.cookieOptions,
        maxAge: SESSION_MAX_AGE_MS,
      },
    })

    this.middleware = [
      sessionHandler,
      (req, _res, next) => {
        const sid = req.session?.id
        const userId = req.session?.userId

        if (userId && sid) {
          void redis
            .hexpire(REDIS_KEYS.USER_SESSIONS(userId), SESSION_TTL_SECONDS, 'FIELDS', 1, sid)
            .catch((err) => {
              this.logger.warn(
                { userId, sid, err: String(err) },
                'Failed to refresh session metadata TTL',
              )
            })
        }

        next()
      },
    ]
  }

  getMiddleware(): RequestHandler[] {
    return this.middleware
  }

  getCookieName(): string {
    return this.cookieName
  }

  getCookieOptions(): CookieOptions {
    return { ...this.cookieOptions }
  }

  getSessionPrefix(): string {
    return this.sessionPrefix
  }
}
