import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { TmdbFindMatch, TmdbFindResponse } from '../types/tmdb-find.types'
import ky, { HTTPError } from 'ky'
import { EnvConfig } from '~/app/config/env.config'
import { sleep } from '~/common/utils/sleep'
import { MediaType } from '~/generated/prisma/enums'
import { RedisService } from '~/infrastructure/redis/redis.service'

const TMDB_API_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p'
const FIND_CACHE_TTL_SECONDS = 30 * 24 * 3600
const FIND_NEGATIVE_CACHE_TTL_SECONDS = 7 * 24 * 3600
const MAX_ATTEMPTS = 4

@Injectable()
export class TmdbFindService {
  private readonly logger = new Logger(TmdbFindService.name)

  constructor(
    private readonly config: ConfigService<EnvConfig, true>,
    private readonly redis: RedisService,
  ) {}

  async findByImdbId(imdbId: string, preferredType: MediaType): Promise<TmdbFindMatch | null> {
    const cacheKey = `tmdb:find:${imdbId}`

    try {
      const cached = await this.redis.get(cacheKey)
      if (cached) {
        const parsed = JSON.parse(cached) as TmdbFindResponse | null
        return parsed ? this.pickMatch(parsed, preferredType) : null
      }
    } catch {
      // ignore
    }

    const response = await this.fetchFind(imdbId)

    try {
      await this.redis.set(
        cacheKey,
        JSON.stringify(response),
        'EX',
        response ? FIND_CACHE_TTL_SECONDS : FIND_NEGATIVE_CACHE_TTL_SECONDS,
      )
    } catch {
      // ignore
    }

    return response ? this.pickMatch(response, preferredType) : null
  }

  private async fetchFind(imdbId: string): Promise<TmdbFindResponse | null> {
    const url = new URL(`${TMDB_API_URL}/find/${imdbId}`)
    url.searchParams.set('api_key', this.config.get('TMDB_API_KEY', { infer: true }))
    url.searchParams.set('external_source', 'imdb_id')
    url.searchParams.set('language', 'en-US')

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        return await ky.get(url.toString()).json<TmdbFindResponse>()
      } catch (error) {
        const status = error instanceof HTTPError ? error.response.status : null

        if (status === 404) {
          return null
        }

        if (status === 429 && attempt < MAX_ATTEMPTS) {
          const retryAfter =
            error instanceof HTTPError ? error.response.headers.get('retry-after') : null
          const retryAfterMs = retryAfter ? Number(retryAfter) * 1000 : 500 * 2 ** (attempt - 1)
          await sleep(
            Number.isFinite(retryAfterMs) && retryAfterMs > 0
              ? retryAfterMs
              : 500 * 2 ** (attempt - 1),
          )
          continue
        }

        this.logger.warn(
          `TMDB find failed for ${imdbId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        )
        throw error
      }
    }

    return null
  }

  private pickMatch(response: TmdbFindResponse, preferredType: MediaType): TmdbFindMatch | null {
    const movie = response.movie_results[0]
    const tv = response.tv_results[0]
    const preferred = preferredType === MediaType.MOVIE ? movie : tv
    const fallback = preferredType === MediaType.MOVIE ? tv : movie
    const match = preferred ?? fallback

    if (!match) {
      return null
    }

    const isMovie = 'title' in match

    return {
      externalId: String(match.id),
      mediaType: isMovie ? MediaType.MOVIE : MediaType.TV_SHOW,
      title: isMovie ? match.title : match.name,
      posterUrl: match.poster_path ? `${TMDB_IMAGE_URL}/w780${match.poster_path}` : null,
    }
  }
}
