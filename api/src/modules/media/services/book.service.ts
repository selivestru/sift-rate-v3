import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { SearchMediaQueryDto } from '../dto/search-media.query'
import { BookSearchItem, BookSearchResult } from '../types/book.types'
import { MediaSearchResponse } from '../types/media.types'
import ky from 'ky'
import { EnvConfig } from '~/app/config/env.config'

@Injectable()
export class BookService {
  private readonly GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1'

  constructor(private readonly configService: ConfigService<EnvConfig>) {}

  async search({ q, page }: SearchMediaQueryDto): Promise<MediaSearchResponse<BookSearchItem>> {
    const url = new URL(this.GOOGLE_BOOKS_API_URL + '/volumes')

    url.searchParams.set('q', q)
    url.searchParams.set('startIndex', String((+page - 1) * 10)) // TODO: fix pagination
    url.searchParams.set('maxResults', String(10)) // TODO: fix pagination
    url.searchParams.set('key', this.configService.getOrThrow<string>('GOOGLE_BOOKS_API_KEY'))

    const response = await ky<BookSearchResult>(url.toString()).json()

    const totalResults = response.totalItems ?? 0
    const totalPages = Math.max(1, Math.ceil(totalResults / 10)) // TODO: handle pagination

    return {
      results: (response.items ?? []).flatMap((volume) => {
        if (!volume.id) return []

        const info = volume.volumeInfo ?? {}

        return [
          {
            id: volume.id,
            title: info.title ?? 'Unknown Title',
            authors: info.authors ?? [],
            coverUrl:
              info.imageLinks?.extraLarge ??
              info.imageLinks?.large ??
              info.imageLinks?.medium ??
              info.imageLinks?.small ??
              info.imageLinks?.thumbnail ??
              info.imageLinks?.smallThumbnail ??
              null,
            year: info.publishedDate ? info.publishedDate.split('-')[0] : '',
            pageCount: info.pageCount ?? null,
            categories: (info.categories ?? []).slice(0, 3),
            rating: info.averageRating ?? null,
          },
        ]
      }),
      totalResults,
      totalPages: Math.min(totalPages, 10),
    }
  }

  getById(id: string) {
    return id
  }
}
