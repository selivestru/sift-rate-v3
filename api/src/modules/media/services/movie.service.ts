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
  TmdbImageRaw,
  TmdbImageSize,
  TmdbMovieDetailRaw,
  TmdbRecommendationRaw,
  TmdbVideoRaw,
} from '../types/movie.types'
import { buildSearchCacheKey, getSearchCache, setSearchCache } from '../utils/search-cache'
import ky, { HTTPError } from 'ky'
import { EnvConfig } from '~/app/config/env.config'
import { RedisService } from '~/infrastructure/redis/redis.service'

@Injectable()
export class MovieService {
  private readonly TMDB_API_URL = 'https://api.themoviedb.org/3'
  private readonly TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p'
  private readonly MOVIE_CACHE_TTL_SECONDS = 7 * 24 * 3600
  private readonly CAST_LIMIT = 16
  private readonly IMAGE_LIMIT = 12
  private readonly SIMILAR_LIMIT = 12
  private readonly WRITER_JOBS = new Set(['Screenplay', 'Writer', 'Story', 'Teleplay'])
  private readonly PRODUCER_JOBS = new Set(['Producer', 'Executive Producer'])

  constructor(
    private readonly config: ConfigService<EnvConfig, true>,
    private readonly redis: RedisService,
  ) {}

  async search({ q, page }: SearchMediaQueryDto): Promise<MediaSearchResponse<MovieSearchItem>> {
    const pageNum = +page
    const cacheKey = buildSearchCacheKey('movie', q, pageNum)
    const cached = await getSearchCache<MediaSearchResponse<MovieSearchItem>>(this.redis, cacheKey)
    if (cached) return cached

    const url = new URL(this.TMDB_API_URL + '/search/movie')

    url.searchParams.set('api_key', this.config.get('TMDB_API_KEY', { infer: true }))
    url.searchParams.set('query', q)
    url.searchParams.set('language', 'en-US')
    url.searchParams.set('page', page)

    const response = await ky<MovieSearchResult>(url.toString()).json()

    const result: MediaSearchResponse<MovieSearchItem> = {
      results: response.results.slice(0, 10).map((movie) => ({
        id: String(movie.id),
        title: movie.title,
        year: movie.release_date ? movie.release_date.split('-')[0] : '',
        posterUrl: movie.poster_path ? `${this.TMDB_IMAGE_URL}/w500${movie.poster_path}` : null,
        rating: Math.round(movie.vote_average * 10) / 10,
        genres: movie.genre_ids.map((id) => MOVIE_GENRES[id]).filter(Boolean),
        overview: movie.overview,
      })),
      totalResults: response.total_results,
      totalPages: Math.min(response.total_pages, 10),
    }

    await setSearchCache(this.redis, cacheKey, result)
    return result
  }

  async getById(id: string): Promise<MovieDetail> {
    const cacheKey = `movie:${id}`

    try {
      const cached = await this.redis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached) as MovieDetail
      }
    } catch {
      void 0
    }

    const url = new URL(`${this.TMDB_API_URL}/movie/${id}`)
    url.searchParams.set('api_key', this.config.get('TMDB_API_KEY', { infer: true }))
    url.searchParams.set('language', 'en-US')
    url.searchParams.set('append_to_response', 'credits,videos,images,recommendations')
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

    try {
      await this.redis.set(cacheKey, JSON.stringify(result), 'EX', this.MOVIE_CACHE_TTL_SECONDS)
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
      tmdbRating: Math.round(raw.vote_average * 10) / 10,
      tmdbVoteCount: raw.vote_count,
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
