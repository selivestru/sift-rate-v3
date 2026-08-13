import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'

import { SESSION_TTL_SECONDS, SessionMiddlewareService } from './session.middleware'
import type { CookieOptions, Request, Response } from 'express'
import { REDIS_KEYS } from '~/common/constants/redis-keys'
import { RedisService } from '~/infrastructure/redis/redis.service'

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name)
  private readonly SESSION_PREFIX: string
  private readonly SESSION_TTL_SECONDS = SESSION_TTL_SECONDS
  private readonly cookieName: string
  private readonly cookieOptions: CookieOptions

  constructor(
    private readonly redis: RedisService,
    sessionMiddleware: SessionMiddlewareService,
  ) {
    this.SESSION_PREFIX = sessionMiddleware.getSessionPrefix()
    this.cookieName = sessionMiddleware.getCookieName()
    this.cookieOptions = sessionMiddleware.getCookieOptions()
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

        const pipeline = this.redis.pipeline()

        pipeline.sadd(setKey, sid)
        pipeline.expire(setKey, this.SESSION_TTL_SECONDS)

        void pipeline.exec().catch((redisErr) => {
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

    const pipeline = this.redis.pipeline()

    pipeline.del(...sessionKeys)
    pipeline.srem(setKey, ...toDelete)

    const results = await pipeline.exec()

    const deletedCount = (results?.[0]?.[1] as number | undefined) ?? 0

    this.logger.log({ userId, deleted: deletedCount }, 'Revoked user sessions')

    return deletedCount
  }
}
