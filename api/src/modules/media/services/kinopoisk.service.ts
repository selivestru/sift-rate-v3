import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { MediaCacheService } from './media-cache.service'
import { TmdbLocalizationService } from './tmdb-localization.service'
import ky from 'ky'
import { EnvConfig } from '~/app/config/env.config'
import { MediaLanguage, MediaType } from '~/generated/prisma/enums'

const TINYFISH_SEARCH_URL = 'https://api.search.tinyfish.ai'
const KINOPOISK_URL_PATTERN = /^https:\/\/www\.kinopoisk\.ru\/(film|series)\/(\d+)\/?$/
const KINOPOISK_NEGATIVE_CACHE_TTL_SECONDS = 7 * 24 * 3600

export type KinopoiskKind = 'movie' | 'tv'

interface TinyFishSearchResult {
  url?: string
}

interface TinyFishSearchResponse {
  results?: TinyFishSearchResult[]
}

@Injectable()
export class KinopoiskService {
  constructor(
    private readonly config: ConfigService<EnvConfig, true>,
    private readonly cache: MediaCacheService,
    private readonly tmdbLocalizationService: TmdbLocalizationService,
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

    const mediaType = kind === 'movie' ? MediaType.MOVIE : MediaType.TV_SHOW
    const localizations = await this.tmdbLocalizationService.getLocalizations(mediaType, tmdbId)
    const localizationTitle = (language: MediaLanguage) =>
      localizations.find((item) => item.language === language)?.title
    const title =
      localizationTitle(MediaLanguage.RU) ?? localizationTitle(MediaLanguage.EN) ?? originalTitle

    const kinopoiskId = await this.searchId(title, year)

    await this.cache.set(
      cacheKey,
      kinopoiskId,
      kinopoiskId ? undefined : KINOPOISK_NEGATIVE_CACHE_TTL_SECONDS,
    )

    return kinopoiskId
  }

  private async searchId(title: string, year?: string): Promise<string | null> {
    if (!title.trim()) return null

    try {
      const url = new URL(TINYFISH_SEARCH_URL)
      url.searchParams.set('query', `"${title}"${year ? ` ${year}` : ''}`)
      url.searchParams.set(
        'purpose',
        'Find the official Kinopoisk film or series page for this title',
      )
      url.searchParams.set('include_domains', 'kinopoisk.ru')
      url.searchParams.set('location', 'RU')
      url.searchParams.set('language', 'ru')

      const response = await ky
        .get(url, {
          headers: {
            'X-API-Key': this.config.get('TINYFISH_API_KEY', { infer: true }),
            'X-TF-Request-Origin': 'api',
            'X-TF-Client-Name': 'siftrate-api',
          },
        })
        .json<TinyFishSearchResponse>()

      for (const result of response.results ?? []) {
        if (!result.url) continue
        const id = this.extractId(result.url)
        if (id) return id
      }
    } catch {
      return null
    }

    return null
  }

  private extractId(link: string): string | null {
    const normalized = link
      .split(/[?#]/)[0]
      .replace(/^https:\/\/kinopoisk\.ru/, 'https://www.kinopoisk.ru')
    const match = KINOPOISK_URL_PATTERN.exec(normalized)
    return match ? match[2] : null
  }
}
