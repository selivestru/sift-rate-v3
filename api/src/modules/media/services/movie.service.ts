import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { MOVIE_GENRES } from '../constants/genres'
import { SearchMediaQueryDto } from '../dto/search-media.query'
import { MediaSearchResponse } from '../types/media.types'
import { MovieSearchItem, MovieSearchResult } from '../types/movie.types'
import ky from 'ky'
import { EnvConfig } from '~/app/config/env.config'

@Injectable()
export class MovieService {
  private readonly TMDB_API_URL = 'https://api.themoviedb.org/3'
  private readonly TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p'

  constructor(private readonly configService: ConfigService<EnvConfig>) {}

  async search({ q, page }: SearchMediaQueryDto): Promise<MediaSearchResponse<MovieSearchItem>> {
    const url = new URL(this.TMDB_API_URL + '/search/movie')

    url.searchParams.set('api_key', this.configService.getOrThrow<string>('TMDB_API_KEY'))
    url.searchParams.set('query', q)
    url.searchParams.set('language', 'en-US')
    url.searchParams.set('page', page)

    const response = await ky<MovieSearchResult>(url.toString()).json()

    return {
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
  }

  getById(id: string) {
    return id
  }
}
