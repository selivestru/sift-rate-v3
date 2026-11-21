import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { MediaCacheService } from './media-cache.service'
import ky from 'ky'
import { EnvConfig } from '~/app/config/env.config'

const POISKKINO_API_URL = 'https://api.poiskkino.dev'
const KINOPOISK_NEGATIVE_CACHE_TTL_SECONDS = 7 * 24 * 3600
const SEARCH_LIMIT = 10
const REQUEST_TIMEOUT_MS = 10_000

export type KinopoiskKind = 'movie' | 'tv'

interface PoiskkinoSearchItem {
  id: number
  name?: string | null
  alternativeName?: string | null
  year?: number | null
  isSeries?: boolean | null
}

interface PoiskkinoSearchResponse {
  docs?: PoiskkinoSearchItem[]
}

const normalizeTitle = (value: string | null | undefined): string => {
  const normalized = (value ?? '')
    .toLowerCase()
    .replaceAll('ё', 'е')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()

  return normalized
}

const normalizeYear = (value: string): number => Number(value.split('-')[0])

@Injectable()
export class KinopoiskService {
  constructor(
    private readonly config: ConfigService<EnvConfig, true>,
    private readonly cache: MediaCacheService,
  ) {}

  async getId(
    kind: KinopoiskKind,
    tmdbId: string,
    originalTitle: string,
    year?: string,
  ): Promise<string | null> {
    const cacheKey = `kinopoisk:${kind}:${tmdbId}`

    const cached = await this.cache.get<string | null>(cacheKey)
    if (cached !== undefined) return cached

    const kinopoiskId = await this.searchId(kind, originalTitle, year)

    await this.cache.set(
      cacheKey,
      kinopoiskId,
      kinopoiskId ? undefined : KINOPOISK_NEGATIVE_CACHE_TTL_SECONDS,
    )

    return kinopoiskId
  }

  private async searchId(
    kind: KinopoiskKind,
    title: string,
    year?: string,
  ): Promise<string | null> {
    const query = title.trim()

    if (!query) return null

    const url = new URL(`${POISKKINO_API_URL}/v1.5/movie/search`)
    url.searchParams.set('query', query)
    url.searchParams.set('limit', String(SEARCH_LIMIT))

    let docs: PoiskkinoSearchItem[]

    try {
      const response = await ky
        .get(url.toString(), {
          headers: { 'X-API-KEY': this.config.get('POISKKINO_API_KEY', { infer: true }) },
          timeout: REQUEST_TIMEOUT_MS,
        })
        .json<PoiskkinoSearchResponse>()

      docs = response.docs ?? []
    } catch {
      return null
    }

    const targetYear = year ? normalizeYear(year) : null
    const isSeries = kind === 'tv'

    for (const doc of docs) {
      if (doc.isSeries !== isSeries) continue

      if (targetYear && doc.year !== targetYear) continue

      const nameMatches =
        normalizeTitle(doc.name) === normalizeTitle(query) ||
        normalizeTitle(doc.alternativeName) === normalizeTitle(query)

      if (nameMatches) {
        return String(doc.id)
      }
    }

    return null
  }
}
