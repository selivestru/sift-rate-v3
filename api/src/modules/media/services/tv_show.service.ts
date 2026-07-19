import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { TV_GENRES } from '../constants/genres'
import { SearchMediaQueryDto } from '../dto/search-media.query'
import { MediaSearchResponse } from '../types/media.types'
import { TvShowSearchItem, TvShowSearchResult } from '../types/tv-show.types'
import ky from 'ky'
import { EnvConfig } from '~/app/config/env.config'

@Injectable()
export class TvShowService {
  private readonly TMDB_API_URL = 'https://api.themoviedb.org/3'
  private readonly TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p'

  constructor(private readonly configService: ConfigService<EnvConfig>) {}

  async search({ q, page }: SearchMediaQueryDto): Promise<MediaSearchResponse<TvShowSearchItem>> {
    const url = new URL(this.TMDB_API_URL + '/search/tv')

    url.searchParams.set('api_key', this.configService.getOrThrow<string>('TMDB_API_KEY'))
    url.searchParams.set('query', q)
    url.searchParams.set('language', 'en-US')
    url.searchParams.set('page', page)

    const response = await ky<TvShowSearchResult>(url.toString()).json()

    return {
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
  }

  getById(id: string) {
    return id
  }
}
