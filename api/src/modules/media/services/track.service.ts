import { Injectable } from '@nestjs/common'

import { SearchMediaQueryDto } from '../dto/search-media.query'
import { MediaSearchResponse } from '../types/media.types'
import { TrackSearchItem, TrackSearchResult } from '../types/track.types'
import ky from 'ky'

@Injectable()
export class TrackService {
  private readonly DEEZER_API_URL = 'https://api.deezer.com'

  async search({ q, page }: SearchMediaQueryDto): Promise<MediaSearchResponse<TrackSearchItem>> {
    const url = new URL(this.DEEZER_API_URL + '/search/track')

    url.searchParams.set('q', q)
    url.searchParams.set('index', String((+page - 1) * 10)) // TODO: fix pagination
    url.searchParams.set('limit', String(10)) // TODO: fix pagination

    const response = await ky<TrackSearchResult>(url.toString()).json()

    const totalResults = response.total ?? 0
    const totalPages = Math.max(1, Math.ceil(totalResults / 10)) // TODO: fix pagination

    return {
      results: response.data.map((track) => ({
        id: String(track.id),
        title: track.title,
        artist: track.artist?.name ?? 'Unknown Artist',
        albumTitle: track.album?.title ?? 'Unknown Album',
        coverUrl: track.album?.cover_medium ?? null,
        duration: track.duration,
        rank: track.rank ?? null,
      })),
      totalResults,
      totalPages: Math.min(totalPages, 10),
    }
  }

  getById(id: string) {
    return id
  }
}
