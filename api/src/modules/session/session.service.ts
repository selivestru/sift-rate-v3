import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'

import { SESSION_TTL_SECONDS, SessionMiddlewareService } from './session.middleware'
import type { CookieOptions, Request, Response } from 'express'
import UAParser from 'ua-parser-js'
import { REDIS_KEYS } from '~/common/constants/redis-keys'
import { RedisService } from '~/infrastructure/redis/redis.service'

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name)
  private readonly sessionPrefix: string
  private readonly cookieName: string
  private readonly cookieOptions: CookieOptions

  constructor(
    private readonly redis: RedisService,
    readonly sessionMiddleware: SessionMiddlewareService,
  ) {
    this.sessionPrefix = sessionMiddleware.getSessionPrefix()
    this.cookieName = sessionMiddleware.getCookieName()
    this.cookieOptions = sessionMiddleware.getCookieOptions()
  }

  async create(req: Request, userId: string): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      req.session.regenerate((err) => {
        if (err) {
          reject(new InternalServerErrorException('Failed to save session, please try again'))
          return
        }

        req.session.userId = userId

        resolve()
      })
    })

    const sid = req.session.id
    const setKey = REDIS_KEYS.USER_SESSIONS(userId)

    const ua = new UAParser(req.headers['user-agent']).getResult()
    const metadata = JSON.stringify({
      browser: ua.browser,
      os: ua.os,
      device: ua.device,
      ip: req.ip,
    })

    const pipeline = this.redis.pipeline()

    pipeline.hset(setKey, sid, metadata)
    pipeline.hexpire(setKey, SESSION_TTL_SECONDS, 'FIELDS', 1, sid)

    await pipeline.exec()
  }

  async revokeCurrent(req: Request, res: Response): Promise<void> {
    await this.destroy(req)
    res.clearCookie(this.cookieName, this.cookieOptions)
  }

  private async destroy(req: Request): Promise<void> {
    const sid = req.session.id
    const userId = req.session.userId

    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(new InternalServerErrorException('Failed to destroy session'))
          return
        }

        resolve()
      })
    })

    if (userId) {
      await this.redis.hdel(REDIS_KEYS.USER_SESSIONS(userId), sid)
    }
  }

  async destroyAllForUser(userId: string, exceptSid?: string): Promise<number> {
    const setKey = REDIS_KEYS.USER_SESSIONS(userId)
    const sids = await this.redis.hkeys(setKey)

    if (sids.length === 0) {
      return 0
    }

    const sidsToDelete = exceptSid ? sids.filter((sid) => sid !== exceptSid) : sids

    if (sidsToDelete.length === 0) {
      return 0
    }

    const deletedCount = await this.redis.hdel(setKey, ...sidsToDelete)

    this.logger.log({ userId, deleted: deletedCount }, 'Revoked user sessions')

    return deletedCount
  }
}
