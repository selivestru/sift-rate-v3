import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { Request } from 'express'
import { EnvConfig } from '~/app/config/env.config'
import { RedisService } from '~/infrastructure/redis/redis.service'

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name)
  private readonly SESSION_PREFIX: string
  private readonly USER_SESSIONS_PREFIX = 'user_sessions:'
  private readonly SESSION_TTL_SECONDS = 604_800

  constructor(
    private readonly redis: RedisService,
    config: ConfigService<EnvConfig, true>,
  ) {
    this.SESSION_PREFIX = config.get('SESSION_PREFIX', { infer: true })
  }

  create(req: Request, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.regenerate((err) => {
        if (err) {
          reject(new InternalServerErrorException('Failed to save session'))
          return
        }

        req.session.userId = userId

        const sid = req.session.id
        const setKey = `${this.USER_SESSIONS_PREFIX}${userId}`

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

  destroy(req: Request): Promise<void> {
    const sid = req.session.id
    const userId = req.session.userId

    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(new InternalServerErrorException('Failed to destroy session'))
          return
        }

        if (userId) {
          this.redis.srem(`${this.USER_SESSIONS_PREFIX}${userId}`, sid).catch((redisErr) => {
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

  async destroyAllForUser(userId: string): Promise<number> {
    const setKey = `${this.USER_SESSIONS_PREFIX}${userId}`
    const sids = await this.redis.smembers(setKey)

    if (sids.length === 0) {
      return 0
    }

    const sessionKeys = sids.map((sid) => `${this.SESSION_PREFIX}${sid}`)
    await Promise.all([...sessionKeys.map((key) => this.redis.del(key)), this.redis.del(setKey)])

    this.logger.log({ userId, deleted: sids.length }, 'Revoked user sessions')

    return sids.length
  }
}
