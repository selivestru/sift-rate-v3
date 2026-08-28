import { Injectable } from '@nestjs/common'

import { isStaleAcrossMusicRelease } from '../utils/music-release-boundary'
import { RedisService } from '~/infrastructure/redis/redis.service'

interface CacheEnvelope<T> {
  cachedAt: number
  data: T
}

export interface MediaCacheGetOptions {
  invalidateAcrossMusicRelease?: boolean
}

@Injectable()
export class MediaCacheService {
  constructor(private readonly redis: RedisService) {}

  async get<T>(key: string, options?: MediaCacheGetOptions): Promise<T | undefined> {
    try {
      const raw = await this.redis.get(key)
      if (!raw) return undefined

      const parsed: unknown = JSON.parse(raw)
      if (parsed == null || typeof parsed !== 'object') return undefined
      if (!('cachedAt' in parsed) || typeof parsed.cachedAt !== 'number') return undefined
      if (!('data' in parsed)) return undefined

      if (options?.invalidateAcrossMusicRelease && isStaleAcrossMusicRelease(parsed.cachedAt)) {
        return undefined
      }

      return parsed.data as T
    } catch {
      // ignore
      return undefined
    }
  }

  async set<T>(key: string, data: T, ttlSeconds?: number): Promise<void> {
    try {
      const envelope: CacheEnvelope<T> = { cachedAt: Date.now(), data }
      const payload = JSON.stringify(envelope)

      if (ttlSeconds === undefined) {
        await this.redis.set(key, payload)
        return
      }

      await this.redis.set(key, payload, 'EX', Math.max(1, Math.floor(ttlSeconds)))
    } catch {
      // ignore
    }
  }
}
