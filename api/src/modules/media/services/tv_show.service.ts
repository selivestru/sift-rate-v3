import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { TV_GENRES } from '../constants/genres'
import { SearchMediaQueryDto } from '../dto/search-media.query'
import { MediaSearchResponse } from '../types/media.types'
import {
  MovieImage,
  MoviePerson,
  MovieSimilarItem,
  MovieVideo,
  TmdbImageRaw,
  TmdbImageSize,
  TmdbVideoRaw,
} from '../types/movie.types'
import {
  TmdbSeasonRaw,
  TmdbTvRecommendationRaw,
  TmdbTvShowRaw,
  TvSeasonSummary,
  TvShowDetail,
  TvShowSearchItem,
  TvShowSearchResult,
} from '../types/tv-show.types'
import { buildSearchCacheKey, getSearchCache, setSearchCache } from '../utils/search-cache'
import ky, { HTTPError } from 'ky'
import { EnvConfig } from '~/app/config/env.config'
import { RedisService } from '~/infrastructure/redis/redis.service'

@Injectable()
export class TvShowService {
  private readonly TMDB_API_URL = 'https://api.themoviedb.org/3'
  private readonly TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p'
  private readonly TV_CACHE_TTL_SECONDS = 7 * 24 * 3600
  private readonly CAST_LIMIT = 16
  private readonly IMAGE_LIMIT = 12
  private readonly SIMILAR_LIMIT = 12

  constructor(
    private readonly config: ConfigService<EnvConfig, true>,
    private readonly redis: RedisService,
  ) {}

  async search({ q, page }: SearchMediaQueryDto): Promise<MediaSearchResponse<TvShowSearchItem>> {
    const pageNum = +page
    const cacheKey = buildSearchCacheKey('tv', q, pageNum)
    const cached = await getSearchCache<MediaSearchResponse<TvShowSearchItem>>(this.redis, cacheKey)
    if (cached) return cached

    const url = new URL(this.TMDB_API_URL + '/search/tv')

    url.searchParams.set('api_key', this.config.get('TMDB_API_KEY', { infer: true }))
    url.searchParams.set('query', q)
    url.searchParams.set('language', 'en-US')
    url.searchParams.set('page', page)

    const response = await ky<TvShowSearchResult>(url.toString()).json()

    const result: MediaSearchResponse<TvShowSearchItem> = {
      results: response.results.slice(0, 10).map((show) => ({
        id: String(show.id),
        title: show.name,
        year: show.first_air_date ? show.first_air_date.split('-')[0] : '',
        posterUrl: show.poster_path ? `${this.TMDB_IMAGE_URL}/w500${show.poster_path}` : null,
        rating: Math.round(show.vote_average * 10) / 10,
        genres: show.genre_ids.map((id) => TV_GENRES[id]).filter(Boolean),
        overview: show.overview,
      })),
      totalResults: response.total_results,
      totalPages: Math.min(response.total_pages, 10),
    }

    await setSearchCache(this.redis, cacheKey, result)
    return result
  }

  async getById(id: string): Promise<TvShowDetail> {
    const cacheKey = `tv:${id}`

    try {
      const cached = await this.redis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached) as TvShowDetail
      }
    } catch {
      void 0
    }

    const url = new URL(`${this.TMDB_API_URL}/tv/${id}`)
    url.searchParams.set('api_key', this.config.get('TMDB_API_KEY', { infer: true }))
    url.searchParams.set('language', 'en-US')
    url.searchParams.set('append_to_response', 'credits,videos,images,recommendations')
    url.searchParams.set('include_image_language', 'en,null')

    let raw: TmdbTvShowRaw

    try {
      raw = await ky.get(url.toString()).json<TmdbTvShowRaw>()
    } catch (error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        throw new NotFoundException('TV show not found')
      }
      throw new InternalServerErrorException(
        `TMDB API error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }

    const result = this.mapTvShowDetail(raw)

    try {
      await this.redis.set(cacheKey, JSON.stringify(result), 'EX', this.TV_CACHE_TTL_SECONDS)
    } catch {
      void 0
    }

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
  }): MoviePerson {
    return {
      id: String(person.id),
      name: person.name,
      profileUrl: this.buildImageUrl(person.profile_path, 'w185'),
      ...(person.character != null ? { character: person.character } : {}),
    }
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

  private mapSimilar(items: TmdbTvRecommendationRaw[] | undefined): MovieSimilarItem[] {
    if (!items?.length) return []

    return items
      .filter((item) => item.poster_path)
      .slice(0, this.SIMILAR_LIMIT)
      .map((item) => ({
        id: String(item.id),
        title: item.name,
        year: item.first_air_date ? item.first_air_date.split('-')[0] : '',
        posterUrl: this.buildImageUrl(item.poster_path, 'w342'),
        rating: Math.round(item.vote_average * 10) / 10,
      }))
  }

  private mapSeasons(seasons: TmdbSeasonRaw[] | undefined): TvSeasonSummary[] {
    if (!seasons?.length) return []

    const mapped = seasons.map((season): TvSeasonSummary => ({
      seasonNumber: season.season_number,
      name: season.name || `Season ${season.season_number}`,
      overview: season.overview || '',
      airDate: season.air_date || '',
      episodeCount: season.episode_count,
      posterUrl: this.buildImageUrl(season.poster_path, 'w342'),
      tmdbRating: Math.round(season.vote_average * 10) / 10,
    }))

    const regular = mapped
      .filter((s) => s.seasonNumber > 0)
      .sort((a, b) => a.seasonNumber - b.seasonNumber)
    const specials = mapped
      .filter((s) => s.seasonNumber === 0)
      .sort((a, b) => a.seasonNumber - b.seasonNumber)

    return [...regular, ...specials]
  }

  private mapTvShowDetail(raw: TmdbTvShowRaw): TvShowDetail {
    const cast = [...(raw.credits?.cast ?? [])]
      .sort((a, b) => a.order - b.order)
      .slice(0, this.CAST_LIMIT)
      .map((c) => this.mapPerson({ ...c, character: c.character }))

    const yearStart = raw.first_air_date ? raw.first_air_date.split('-')[0] : ''
    const yearEnd = raw.last_air_date ? raw.last_air_date.split('-')[0] : ''

    return {
      id: String(raw.id),
      title: raw.name,
      originalTitle: raw.original_name,
      tagline: raw.tagline || '',
      overview: raw.overview || '',
      firstAirDate: raw.first_air_date || '',
      lastAirDate: raw.last_air_date || '',
      yearStart,
      yearEnd,
      status: raw.status || '',
      type: raw.type || '',
      inProduction: Boolean(raw.in_production),
      seasonCount: raw.number_of_seasons,
      episodeCount: raw.number_of_episodes,
      genres: raw.genres.map((g) => g.name),
      tmdbRating: Math.round(raw.vote_average * 10) / 10,
      tmdbVoteCount: raw.vote_count,
      posterUrl: this.buildImageUrl(raw.poster_path, 'w780'),
      backdropUrl: this.buildImageUrl(raw.backdrop_path, 'original'),
      networks: raw.networks.map((n) => n.name).filter(Boolean),
      languages: raw.spoken_languages.map((l) => l.english_name || l.name).filter(Boolean),
      countries: raw.production_countries.map((c) => c.name).filter(Boolean),
      studios: raw.production_companies.map((c) => c.name).filter(Boolean),
      createdBy: raw.created_by.map((c) => c.name).filter(Boolean),
      episodeRunTimeMinutes: raw.episode_run_time.find((minutes) => minutes > 0) ?? null,
      seasons: this.mapSeasons(raw.seasons),
      cast,
      videos: this.mapVideos(raw.videos?.results),
      backdrops: this.mapImages(raw.images?.backdrops, 'w780'),
      posters: this.mapImages(raw.images?.posters, 'w500'),
      similar: this.mapSimilar(raw.recommendations?.results),
    }
  }
}
