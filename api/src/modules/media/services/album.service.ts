import { Injectable } from '@nestjs/common'

import { SearchMediaQueryDto } from '../dto/search-media.query'
import { AlbumSearchItem, AlbumSearchResult } from '../types/album.types'
import { MediaSearchResponse } from '../types/media.types'
import ky from 'ky'

@Injectable()
export class AlbumService {
  private readonly DEEZER_API_URL = 'https://api.deezer.com'

  async search({ q, page }: SearchMediaQueryDto): Promise<MediaSearchResponse<AlbumSearchItem>> {
    const url = new URL(this.DEEZER_API_URL + '/search/album')

    url.searchParams.set('q', q)
    url.searchParams.set('index', String((+page - 1) * 10)) // TODO: fix pagination
    url.searchParams.set('limit', String(10)) // TODO: fix pagination

    const response = await ky<AlbumSearchResult>(url.toString()).json()

    const totalResults = response.total ?? 0
    const totalPages = Math.max(1, Math.ceil(totalResults / 10)) // TODO: handle pagination

    return {
      results: response.data.map((album) => ({
        id: String(album.id),
        title: album.title,
        artist: album.artist?.name ?? 'Unknown Artist',
        coverUrl: album.cover_big ?? null,
        nbTracks: album.nb_tracks ?? null,
      })),
      totalResults,
      totalPages: Math.min(totalPages, 10),
    }
  }

  getById(id: string) {
    return id
  }
}
