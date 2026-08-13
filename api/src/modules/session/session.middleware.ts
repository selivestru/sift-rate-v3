import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import RedisStore from 'connect-redis'
import type { CookieOptions, RequestHandler } from 'express'
import session from 'express-session'
import { EnvConfig } from '~/app/config/env.config'
import { RedisService } from '~/infrastructure/redis/redis.service'

export const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000
export const SESSION_TTL_SECONDS = SESSION_MAX_AGE_MS / 1000

@Injectable()
export class SessionMiddlewareService {
  private readonly middleware: RequestHandler
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

    this.middleware = session({
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
  }

  getMiddleware(): RequestHandler {
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
