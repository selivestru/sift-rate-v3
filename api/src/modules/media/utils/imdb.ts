import { ConfigService } from '@nestjs/config'

import ky from 'ky'
import { EnvConfig } from '~/app/config/env.config'
import { RedisService } from '~/infrastructure/redis/redis.service'

const OMDB_API_URL = 'https://www.omdbapi.com'
const IMDB_TITLE_URL = 'https://www.imdb.com/title'
const IMDB_CACHE_TTL_SECONDS = 30 * 24 * 3600
const IMDB_NEGATIVE_CACHE_TTL_SECONDS = 7 * 24 * 3600
const BROWSER_USER_AGENT =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'

export interface ImdbRating {
  rating: number
  votes: number
}

interface OmdbResponse {
  Response: string
  imdbRating?: string
  imdbVotes?: string
  Error?: string
}

interface AggregateRating {
  ratingValue?: number | string
  ratingCount?: number | string
}

const buildCacheKey = (imdbId: string) => `imdb:rating:${imdbId}`

const parseOmdbNumber = (value: string | number | undefined): number | null => {
  if (value == null) return null
  const normalized = String(value).replace(/,/g, '').trim()
  if (!normalized || normalized === 'N/A') return null
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

const fetchFromOmdb = async (
  config: ConfigService<EnvConfig, true>,
  imdbId: string,
): Promise<ImdbRating | null> => {
  const apiKey = config.get('OMDB_API_KEY', { infer: true })
  if (!apiKey) return null

  const url = new URL(OMDB_API_URL)
  url.searchParams.set('i', imdbId)
  url.searchParams.set('apikey', apiKey)

  const data = await ky<OmdbResponse>(url.toString()).json()

  if (data.Response === 'False') {
    throw new Error(`OMDb error: ${data.Error ?? 'not found'}`)
  }

  const rating = parseOmdbNumber(data.imdbRating)
  const votes = parseOmdbNumber(data.imdbVotes)

  if (rating == null || votes == null) {
    throw new Error('OMDb response is missing imdb rating')
  }

  return { rating, votes }
}

const findAggregateRating = (value: unknown): AggregateRating | null => {
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findAggregateRating(item)
      if (found) return found
    }
    return null
  }

  if (!value || typeof value !== 'object') {
    return null
  }

  const obj = value as Record<string, unknown>

  if (obj.aggregateRating && typeof obj.aggregateRating === 'object') {
    const aggregate = obj.aggregateRating as Record<string, unknown>
    return {
      ratingValue: aggregate.ratingValue as number | string | undefined,
      ratingCount: aggregate.ratingCount as number | string | undefined,
    }
  }

  for (const [key, child] of Object.entries(obj)) {
    if (key === 'aggregateRating') continue
    const found = findAggregateRating(child)
    if (found) return found
  }

  return null
}

const scrapeFromImdb = async (imdbId: string): Promise<ImdbRating | null> => {
  const html = await ky(`${IMDB_TITLE_URL}/${imdbId}/`, {
    headers: {
      'User-Agent': BROWSER_USER_AGENT,
      'Accept-Language': 'en-US,en;q=0.9',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  }).text()

  const match = html.match(/<script\s+type=["']application\/ld\+json["']\s*>([\s\S]*?)<\/script>/i)
  if (!match) return null

  const aggregateRating = findAggregateRating(JSON.parse(match[1]))
  if (!aggregateRating) return null

  const rating = parseOmdbNumber(aggregateRating.ratingValue)
  const votes = parseOmdbNumber(aggregateRating.ratingCount)

  if (rating == null || votes == null) return null

  return { rating, votes }
}

export const getImdbRating = async (
  config: ConfigService<EnvConfig, true>,
  redis: RedisService,
  imdbId: string,
): Promise<ImdbRating | null> => {
  const cacheKey = buildCacheKey(imdbId)

  try {
    const cached = await redis.get(cacheKey)
    if (cached) {
      return JSON.parse(cached) as ImdbRating | null
    }
  } catch {
    // ignore
  }

  let rating: ImdbRating | null = null

  try {
    rating = await fetchFromOmdb(config, imdbId)
  } catch {
    rating = null
  }

  if (!rating) {
    try {
      rating = await scrapeFromImdb(imdbId)
    } catch {
      rating = null
    }
  }

  try {
    await redis.set(
      cacheKey,
      JSON.stringify(rating),
      'EX',
      rating ? IMDB_CACHE_TTL_SECONDS : IMDB_NEGATIVE_CACHE_TTL_SECONDS,
    )
  } catch {
    // ignore
  }

  return rating
}
