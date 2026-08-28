import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import type { MediaLocalizationSnapshot } from '../types/media-localization.types'
import { DETAIL_CACHE_TTL_SECONDS } from '../utils/media-cache-policy'
import {
  isLocalizableMediaType,
  MEDIA_LANGUAGES,
  TMDB_ISO_639_1,
  TMDB_LANGUAGE,
} from '../utils/media-localization'
import { MediaCacheService } from './media-cache.service'
import ky, { HTTPError } from 'ky'
import { EnvConfig } from '~/app/config/env.config'
import { MediaLanguage, MediaType } from '~/generated/prisma/enums'

interface TmdbTranslationItem {
  iso_639_1: string
  iso_3166_1: string
  data: {
    title?: string | null
    name?: string | null
  }
}

interface TmdbImageItem {
  file_path: string
  iso_639_1: string | null
  vote_average: number
}

interface TmdbLocalizationRaw {
  translations?: {
    translations: TmdbTranslationItem[]
  }
  images?: {
    posters: TmdbImageItem[]
  }
}

@Injectable()
export class TmdbLocalizationService {
  private readonly TMDB_API_URL = 'https://api.themoviedb.org/3'
  private readonly TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p'

  constructor(
    private readonly config: ConfigService<EnvConfig, true>,
    private readonly cache: MediaCacheService,
  ) {}

  async getLocalizations(
    mediaType: MediaType,
    externalId: string,
  ): Promise<MediaLocalizationSnapshot[]> {
    if (!isLocalizableMediaType(mediaType)) {
      return []
    }

    const kind = mediaType === MediaType.MOVIE ? 'movie' : 'tv'
    const cacheKey = `localization:${kind}:${externalId}`
    const cached = await this.cache.get<MediaLocalizationSnapshot[]>(cacheKey)
    if (cached) {
      return cached
    }

    const path = mediaType === MediaType.MOVIE ? `/movie/${externalId}` : `/tv/${externalId}`
    const url = new URL(`${this.TMDB_API_URL}${path}`)
    url.searchParams.set('api_key', this.config.get('TMDB_API_KEY', { infer: true }))
    url.searchParams.set('append_to_response', 'translations,images')
    url.searchParams.set('include_image_language', 'en,uk,ru,null')

    let raw: TmdbLocalizationRaw

    try {
      raw = await ky.get(url.toString()).json<TmdbLocalizationRaw>()
    } catch (error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        throw new NotFoundException(
          mediaType === MediaType.MOVIE ? 'Movie not found' : 'TV show not found',
        )
      }

      throw new InternalServerErrorException(
        `TMDB API error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }

    const translations = raw.translations?.translations ?? []
    const posters = raw.images?.posters ?? []

    const result = MEDIA_LANGUAGES.map((language) => ({
      language,
      title: this.pickTitle(translations, language, mediaType),
      posterUrl: this.pickPoster(posters, language),
    }))

    await this.cache.set(cacheKey, result, DETAIL_CACHE_TTL_SECONDS.standard)
    return result
  }

  private pickTitle(
    translations: TmdbTranslationItem[],
    language: MediaLanguage,
    mediaType: MediaType,
  ): string | null {
    const match = this.pickTranslation(translations, language)
    if (!match) {
      return null
    }

    const value = mediaType === MediaType.MOVIE ? match.data.title : match.data.name
    return this.normalizeEmpty(value)
  }

  private pickTranslation(
    translations: TmdbTranslationItem[],
    language: MediaLanguage,
  ): TmdbTranslationItem | null {
    const iso = TMDB_ISO_639_1[language]
    const region = TMDB_LANGUAGE[language].slice(-2)
    const matches = translations.filter((item) => item.iso_639_1 === iso)
    return matches.find((item) => item.iso_3166_1 === region) ?? matches[0] ?? null
  }

  private pickPoster(posters: TmdbImageItem[], language: MediaLanguage): string | null {
    const iso = TMDB_ISO_639_1[language]
    const matches = posters.filter((poster) => poster.iso_639_1 === iso)

    if (matches.length === 0) {
      const neutral = posters.filter((poster) => poster.iso_639_1 === null)

      if (neutral.length === 0) {
        return null
      }

      const bestNeutral = [...neutral].sort(
        (left, right) => right.vote_average - left.vote_average,
      )[0]

      return bestNeutral?.file_path ? `${this.TMDB_IMAGE_URL}/w780${bestNeutral.file_path}` : null
    }

    const best = [...matches].sort((left, right) => right.vote_average - left.vote_average)[0]
    if (!best?.file_path) {
      return null
    }

    return `${this.TMDB_IMAGE_URL}/w780${best.file_path}`
  }

  private normalizeEmpty(value?: string | null): string | null {
    const trimmed = value?.trim()
    return trimmed ? trimmed : null
  }
}
