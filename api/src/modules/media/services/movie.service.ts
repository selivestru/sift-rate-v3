import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { MOVIE_GENRES } from '../constants/genres'
import { SearchMediaQueryDto } from '../dto/search-media.query'
import { MediaSearchResponse } from '../types/media.types'
import {
  MovieDetail,
  MovieImage,
  MoviePerson,
  MovieSearchItem,
  MovieSearchResult,
  MovieSimilarItem,
  MovieVideo,
  TmdbExternalIdsRaw,
  TmdbImageRaw,
  TmdbImageSize,
  TmdbMovieDetailRaw,
  TmdbRecommendationRaw,
  TmdbVideoRaw,
} from '../types/movie.types'
import { getImdbRating } from '../utils/imdb'
import {
  buildDetailCacheKey,
  buildSearchCacheKey,
  resolveDetailTtlSeconds,
  SEARCH_CACHE_TTL_SECONDS,
} from '../utils/media-cache-policy'
import { toTmdbLanguage } from '../utils/media-localization'
import { KinopoiskService } from './kinopoisk.service'
import { MediaCacheService } from './media-cache.service'
import ky, { HTTPError } from 'ky'
import { EnvConfig } from '~/app/config/env.config'
import { DEFAULT_MEDIA_LANGUAGE } from '~/common/decorators/current-language.decorator'
import { MediaLanguage } from '~/generated/prisma/enums'

@Injectable()
export class MovieService {
  private readonly TMDB_API_URL = 'https://api.themoviedb.org/3'
  private readonly TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p'
  private readonly CAST_LIMIT = 16
  private readonly IMAGE_LIMIT = 12
  private readonly SIMILAR_LIMIT = 12
  private readonly WRITER_JOBS = new Set(['Screenplay', 'Writer', 'Story', 'Teleplay'])
  private readonly PRODUCER_JOBS = new Set(['Producer', 'Executive Producer'])

  constructor(
    private readonly config: ConfigService<EnvConfig, true>,
    private readonly cache: MediaCacheService,
    private readonly kinopoiskService: KinopoiskService,
  ) {}

  async search(
    { q, page }: SearchMediaQueryDto,
    language: MediaLanguage = DEFAULT_MEDIA_LANGUAGE,
  ): Promise<MediaSearchResponse<MovieSearchItem>> {
    const pageNum = +page
    const cacheKey = buildSearchCacheKey('movie', q, pageNum, language)
    const cached = await this.cache.get<MediaSearchResponse<MovieSearchItem>>(cacheKey)
    if (cached) return cached

    const url = new URL(this.TMDB_API_URL + '/search/movie')

    url.searchParams.set('api_key', this.config.get('TMDB_API_KEY', { infer: true }))
    url.searchParams.set('query', q)
    url.searchParams.set('language', toTmdbLanguage(language))
    url.searchParams.set('page', page)

    const response = await ky<MovieSearchResult>(url.toString()).json()

    const results = await Promise.all(
      response.results.slice(0, 10).map(async (movie) => ({
        id: String(movie.id),
        title: movie.title,
        year: movie.release_date ? movie.release_date.split('-')[0] : '',
        posterUrl: movie.poster_path ? `${this.TMDB_IMAGE_URL}/w500${movie.poster_path}` : null,
        rating: await this.fetchImdbRating(String(movie.id)),
        genres: movie.genre_ids.map((id) => MOVIE_GENRES[id]).filter(Boolean),
        overview: movie.overview,
      })),
    )

    const result: MediaSearchResponse<MovieSearchItem> = {
      results,
      totalResults: response.total_results,
      totalPages: Math.min(response.total_pages, 10),
    }

    await this.cache.set(cacheKey, result, SEARCH_CACHE_TTL_SECONDS)
    return result
  }

  private async fetchImdbRating(tmdbId: string): Promise<number | null> {
    const externalUrl = new URL(`${this.TMDB_API_URL}/movie/${tmdbId}/external_ids`)
    externalUrl.searchParams.set('api_key', this.config.get('TMDB_API_KEY', { infer: true }))

    let external: TmdbExternalIdsRaw

    try {
      external = await ky<TmdbExternalIdsRaw>(externalUrl.toString()).json()
    } catch {
      return null
    }

    if (!external.imdb_id) return null

    const imdb = await getImdbRating(this.config, this.cache, external.imdb_id)
    return imdb?.rating ?? null
  }

  async getById(
    id: string,
    language: MediaLanguage = DEFAULT_MEDIA_LANGUAGE,
  ): Promise<MovieDetail> {
    const cacheKey = buildDetailCacheKey('movie', id, language)

    const cached = await this.cache.get<MovieDetail>(cacheKey)
    if (cached?.kinopoiskId) return cached

    if (cached) {
      const kinopoiskId = await this.kinopoiskService.getId(
        'movie',
        id,
        cached.originalTitle,
        cached.year,
      )
      if (!kinopoiskId) return cached

      const result = { ...cached, kinopoiskId }
      await this.cache.set(
        cacheKey,
        result,
        resolveDetailTtlSeconds({
          kind: 'movie',
          releaseDate: result.releaseDate,
          status: result.status,
        }),
      )
      return result
    }

    const url = new URL(`${this.TMDB_API_URL}/movie/${id}`)
    url.searchParams.set('api_key', this.config.get('TMDB_API_KEY', { infer: true }))
    url.searchParams.set('language', toTmdbLanguage(language))
    url.searchParams.set('append_to_response', 'credits,videos,images,recommendations,external_ids')
    url.searchParams.set('include_image_language', 'en,null')

    let raw: TmdbMovieDetailRaw

    try {
      raw = await ky.get(url.toString()).json<TmdbMovieDetailRaw>()
    } catch (error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        throw new NotFoundException('Movie not found')
      }
      throw new InternalServerErrorException(
        `TMDB API error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }

    const result = this.mapMovieDetail(raw)

    const imdbId = raw.external_ids?.imdb_id

    if (imdbId) {
      const imdbRating = await getImdbRating(this.config, this.cache, imdbId)
      result.imdbRating = imdbRating?.rating ?? null
      result.imdbVoteCount = imdbRating?.votes ?? null
    }

    result.kinopoiskId = await this.kinopoiskService.getId(
      'movie',
      id,
      result.originalTitle,
      result.year,
    )

    await this.cache.set(
      cacheKey,
      result,
      resolveDetailTtlSeconds({
        kind: 'movie',
        releaseDate: result.releaseDate,
        status: result.status,
      }),
    )

    return result
  }

  private buildImageUrl(path: string | null | undefined, size: TmdbImageSize): string | null {
    if (!path) return null
    return `${this.TMDB_IMAGE_URL}/${size}${path}`
  }

  private mapPerson(person: {
    id: number
    name: string
    profile_path: string | null
    character?: string
    job?: string
  }): MoviePerson {
    return {
      id: String(person.id),
      name: person.name,
      profileUrl: this.buildImageUrl(person.profile_path, 'w185'),
      ...(person.character != null ? { character: person.character } : {}),
      ...(person.job != null ? { job: person.job } : {}),
    }
  }

  private uniqueById(people: MoviePerson[], limit: number): MoviePerson[] {
    const seen = new Set<string>()
    const result: MoviePerson[] = []

    for (const person of people) {
      if (seen.has(person.id)) continue
      seen.add(person.id)
      result.push(person)
      if (result.length >= limit) break
    }

    return result
  }

  private mapImages(
    images: TmdbImageRaw[] | undefined,
    thumbSize: 'w342' | 'w500' | 'w780',
  ): MovieImage[] {
    if (!images?.length) return []

    return [...images]
      .sort((a, b) => b.vote_average - a.vote_average)
      .slice(0, this.IMAGE_LIMIT)
      .map((img) => ({
        url: this.buildImageUrl(img.file_path, 'original')!,
        thumbUrl: this.buildImageUrl(img.file_path, thumbSize)!,
        width: img.width,
        height: img.height,
      }))
  }

  private mapVideos(videos: TmdbVideoRaw[] | undefined): MovieVideo[] {
    if (!videos?.length) return []

    const youtube = videos.filter((v) => v.site === 'YouTube' && v.key)

    const score = (v: TmdbVideoRaw) => {
      let s = 0
      if (v.type === 'Trailer') s += 100
      else if (v.type === 'Teaser') s += 50
      if (v.official) s += 20
      return s
    }

    return [...youtube]
      .sort((a, b) => score(b) - score(a))
      .slice(0, 8)
      .map((v) => ({
        id: v.id,
        key: v.key,
        name: v.name,
      }))
  }

  private mapSimilar(items: TmdbRecommendationRaw[] | undefined): MovieSimilarItem[] {
    if (!items?.length) return []

    return items
      .filter((item) => item.poster_path)
      .slice(0, this.SIMILAR_LIMIT)
      .map((item) => ({
        id: String(item.id),
        title: item.title,
        year: item.release_date ? item.release_date.split('-')[0] : '',
        posterUrl: this.buildImageUrl(item.poster_path, 'w342'),
        rating: Math.round(item.vote_average * 10) / 10,
      }))
  }

  private mapMovieDetail(raw: TmdbMovieDetailRaw): MovieDetail {
    const cast = [...(raw.credits?.cast ?? [])]
      .sort((a, b) => a.order - b.order)
      .slice(0, this.CAST_LIMIT)
      .map((c) => this.mapPerson({ ...c, character: c.character }))

    const crew = raw.credits?.crew ?? []

    const directors = this.uniqueById(
      crew.filter((c) => c.job === 'Director').map((c) => this.mapPerson({ ...c, job: c.job })),
      3,
    )

    const writers = this.uniqueById(
      crew
        .filter((c) => this.WRITER_JOBS.has(c.job))
        .map((c) => this.mapPerson({ ...c, job: c.job })),
      4,
    )

    const producers = this.uniqueById(
      crew
        .filter((c) => this.PRODUCER_JOBS.has(c.job))
        .map((c) => this.mapPerson({ ...c, job: c.job })),
      4,
    )

    return {
      id: String(raw.id),
      title: raw.title,
      originalTitle: raw.original_title,
      tagline: raw.tagline || '',
      overview: raw.overview || '',
      year: raw.release_date ? raw.release_date.split('-')[0] : '',
      releaseDate: raw.release_date || '',
      runtimeMinutes: raw.runtime && raw.runtime > 0 ? raw.runtime : null,
      status: raw.status || '',
      genres: raw.genres.map((g) => g.name),
      imdbId: raw.external_ids?.imdb_id ?? null,
      kinopoiskId: null,
      imdbRating: null,
      imdbVoteCount: null,
      posterUrl: this.buildImageUrl(raw.poster_path, 'w780'),
      backdropUrl: this.buildImageUrl(raw.backdrop_path, 'original'),
      languages: raw.spoken_languages.map((l) => l.english_name || l.name).filter(Boolean),
      countries: raw.production_countries.map((c) => c.name).filter(Boolean),
      studios: raw.production_companies.map((c) => c.name).filter(Boolean),
      budget: raw.budget > 0 ? raw.budget : null,
      revenue: raw.revenue > 0 ? raw.revenue : null,
      cast,
      directors,
      writers,
      producers,
      videos: this.mapVideos(raw.videos?.results),
      backdrops: this.mapImages(raw.images?.backdrops, 'w780'),
      posters: this.mapImages(raw.images?.posters, 'w500'),
      similar: this.mapSimilar(raw.recommendations?.results),
    }
  }
}
