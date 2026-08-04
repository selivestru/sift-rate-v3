import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import type { CookieOptions } from 'express'
import { Request, Response } from 'express'
import { EnvConfig } from '~/app/config/env.config'
import { REDIS_KEYS } from '~/common/constants/redis-keys'
import { RedisService } from '~/infrastructure/redis/redis.service'

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name)
  private readonly SESSION_PREFIX: string
  private readonly SESSION_TTL_SECONDS = 604_800
  private readonly cookieName: string
  private readonly cookieOptions: CookieOptions

  constructor(
    private readonly redis: RedisService,
    config: ConfigService<EnvConfig, true>,
  ) {
    this.SESSION_PREFIX = config.get('SESSION_PREFIX', { infer: true })

    const isProd = config.get('NODE_ENV', { infer: true }) === 'production'
    this.cookieName = isProd ? '__Host-sid' : 'sid'
    this.cookieOptions = {
      path: '/',
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
    }
  }

  create(req: Request, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.regenerate((err) => {
        if (err) {
          reject(new InternalServerErrorException('Failed to save session, please try again'))
          return
        }

        req.session.userId = userId

        const sid = req.session.id
        const setKey = REDIS_KEYS.USER_SESSIONS(userId)

        void Promise.all([
          this.redis.sadd(setKey, sid),
          this.redis.expire(setKey, this.SESSION_TTL_SECONDS),
        ]).catch((redisErr) => {
          this.logger.warn({ userId, err: String(redisErr) }, 'Failed to index user session')
        })

        resolve()
      })
    })
  }

  async revokeCurrent(req: Request, res: Response): Promise<void> {
    await this.destroy(req)
    res.clearCookie(this.cookieName, this.cookieOptions)
  }

  private destroy(req: Request): Promise<void> {
    const sid = req.session.id
    const userId = req.session.userId

    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(new InternalServerErrorException('Failed to destroy session'))
          return
        }

        if (userId) {
          this.redis.srem(REDIS_KEYS.USER_SESSIONS(userId), sid).catch((redisErr) => {
            this.logger.warn(
              { userId, err: String(redisErr) },
              'Failed to remove session from index',
            )
          })
        }

        resolve()
      })
    })
  }

  async destroyAllForUser(userId: string, exceptSid?: string): Promise<number> {
    const setKey = REDIS_KEYS.USER_SESSIONS(userId)
    const sids = await this.redis.smembers(setKey)

    if (sids.length === 0) {
      return 0
    }

    const toDelete = exceptSid ? sids.filter((sid) => sid !== exceptSid) : sids

    if (toDelete.length === 0) {
      return 0
    }

    const sessionKeys = toDelete.map((sid) => `${this.SESSION_PREFIX}${sid}`)

    await Promise.all([
      ...sessionKeys.map((key) => this.redis.del(key)),
      this.redis.srem(setKey, ...toDelete),
    ])

    this.logger.log({ userId, deleted: toDelete.length }, 'Revoked user sessions')

    return toDelete.length
  }
}
