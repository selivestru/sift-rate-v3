import { isStaleAcrossMusicRelease } from './music-release-boundary'
import { RedisService } from '~/infrastructure/redis/redis.service'

export const SEARCH_CACHE_TTL_SECONDS = 24 * 3600

export type SearchCacheKind = 'movie' | 'tv' | 'game' | 'book' | 'track' | 'album'

type SearchCacheEnvelope<T> = {
  cachedAt: number
  data: T
}

const normalizeSearchQuery = (query: string) => query.trim().toLowerCase().replace(/\s+/g, ' ')

export const buildSearchCacheKey = (kind: SearchCacheKind, query: string, page: number) => {
  const normalized = normalizeSearchQuery(query)
  return `search:${kind}:${normalized}:p${page}`
}

export const getSearchCache = async <T>(
  redis: RedisService,
  key: string,
  options?: { invalidateAcrossMusicRelease?: boolean },
): Promise<T | null> => {
  try {
    const raw = await redis.get(key)
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    if (parsed == null || typeof parsed !== 'object') return null
    if (!('cachedAt' in parsed) || !('data' in parsed)) return null
    if (typeof parsed.cachedAt !== 'number') return null

    if (options?.invalidateAcrossMusicRelease && isStaleAcrossMusicRelease(parsed.cachedAt)) {
      return null
    }

    return parsed.data as T
  } catch {
    return null
  }
}

export const setSearchCache = async <T>(
  redis: RedisService,
  key: string,
  data: T,
): Promise<void> => {
  const envelope: SearchCacheEnvelope<T> = {
    cachedAt: Date.now(),
    data,
  }

  try {
    await redis.set(key, JSON.stringify(envelope), 'EX', SEARCH_CACHE_TTL_SECONDS)
  } catch {
    // ignore
  }
}
