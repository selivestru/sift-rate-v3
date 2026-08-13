import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'

import { SESSION_TTL_SECONDS, SessionMiddlewareService } from './session.middleware'
import type { SessionMetadata, UserSession } from './types/session.types'
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

  async create(req: Request, res: Response, userId: string): Promise<void> {
    const prevSid = req.session.id
    const prevUserId = req.session.userId

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

    try {
      const pipeline = this.redis.pipeline()

      if (prevUserId && prevSid && prevSid !== sid) {
        pipeline.hdel(REDIS_KEYS.USER_SESSIONS(prevUserId), prevSid)
      }

      pipeline.hset(setKey, sid, metadata)
      pipeline.hexpire(setKey, SESSION_TTL_SECONDS, 'FIELDS', 1, sid)

      const results = await pipeline.exec()

      if (!results) {
        throw new InternalServerErrorException('Failed to persist session metadata')
      }

      for (const [err] of results) {
        if (err) {
          throw new InternalServerErrorException('Failed to persist session metadata')
        }
      }
    } catch (err) {
      this.logger.warn({ userId, sid }, 'Failed to persist session metadata, rolling back')

      try {
        await this.revokeCurrent(req, res)
      } catch (err) {
        this.logger.error(
          { userId, err: String(err) },
          'Failed to roll back session after metadata error',
        )
      }

      throw err
    }
  }

  async getAllForUser(userId: string, currentSid: string): Promise<UserSession[]> {
    const entries = await this.redis.hgetall(REDIS_KEYS.USER_SESSIONS(userId))

    return Object.entries(entries).map(([sid, raw]) => {
      let metadata: SessionMetadata = {
        browser: { name: undefined, version: undefined, major: undefined },
        os: { name: undefined, version: undefined },
        device: { model: undefined, type: undefined, vendor: undefined },
        ip: undefined,
      }

      try {
        metadata = JSON.parse(raw) as SessionMetadata
      } catch {
        this.logger.warn({ userId, sid }, 'Failed to parse session metadata')
      }

      return {
        sid,
        isCurrent: sid === currentSid,
        ...metadata,
      }
    })
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

    const pipeline = this.redis.pipeline()

    pipeline.hdel(setKey, ...sidsToDelete)

    for (const sid of sidsToDelete) {
      pipeline.del(this.sessionPrefix + sid)
    }

    if (!exceptSid) {
      pipeline.del(setKey)
    }

    const results = await pipeline.exec()

    if (!results) {
      throw new InternalServerErrorException('Failed to revoke sessions')
    }

    for (const [err] of results) {
      if (err) {
        throw err
      }
    }

    const deletedCount = results[0][1] as number

    this.logger.log({ userId, deleted: deletedCount }, 'Revoked user sessions')

    return deletedCount
  }

  async revoke(userId: string, currentSid: string, sid: string): Promise<{ revoked: number }> {
    if (sid === currentSid) {
      throw new BadRequestException('Cannot revoke the current session')
    }

    const pipeline = this.redis.pipeline()

    pipeline.hdel(REDIS_KEYS.USER_SESSIONS(userId), sid)
    pipeline.del(this.sessionPrefix + sid)

    const results = await pipeline.exec()

    if (!results) {
      throw new InternalServerErrorException('Failed to revoke session')
    }

    for (const [err] of results) {
      if (err) {
        throw err
      }
    }

    const deletedCount = results[0][1] as number

    if (deletedCount === 0) {
      throw new NotFoundException('Session not found')
    }

    return { revoked: deletedCount }
  }
}
