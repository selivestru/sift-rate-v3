import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { SearchMediaQueryDto } from '../dto/search-media.query'
import {
  BookDetail,
  BookRelatedItem,
  BookSearchItem,
  BookSearchResult,
  GoogleBooksListResponse,
  GoogleImageLinks,
  GoogleIndustryIdentifier,
  GoogleVolume,
} from '../types/book.types'
import { MediaSearchResponse } from '../types/media.types'
import { buildSearchCacheKey, getSearchCache, setSearchCache } from '../utils/search-cache'
import ky, { HTTPError } from 'ky'
import { EnvConfig } from '~/app/config/env.config'
import { RedisService } from '~/infrastructure/redis/redis.service'

@Injectable()
export class BookService {
  private readonly GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1'
  private readonly BOOK_CACHE_TTL_SECONDS = 7 * 24 * 3600
  private readonly MORE_BY_AUTHOR_LIMIT = 12

  constructor(
    private readonly configService: ConfigService<EnvConfig>,
    private readonly redisService: RedisService,
  ) {}

  async search({ q, page }: SearchMediaQueryDto): Promise<MediaSearchResponse<BookSearchItem>> {
    const pageNum = +page
    const cacheKey = buildSearchCacheKey('book', q, pageNum)
    const cached = await getSearchCache<MediaSearchResponse<BookSearchItem>>(
      this.redisService,
      cacheKey,
    )
    if (cached) return cached

    const url = new URL(this.GOOGLE_BOOKS_API_URL + '/volumes')

    url.searchParams.set('q', q)
    url.searchParams.set('startIndex', String((pageNum - 1) * 10)) // TODO: fix pagination
    url.searchParams.set('maxResults', String(10)) // TODO: fix pagination
    url.searchParams.set('key', this.configService.getOrThrow<string>('GOOGLE_BOOKS_API_KEY'))

    const response = await ky<BookSearchResult>(url.toString()).json()

    const totalResults = response.totalItems ?? 0
    const totalPages = Math.max(1, Math.ceil(totalResults / 10)) // TODO: handle pagination

    const result: MediaSearchResponse<BookSearchItem> = {
      results: (response.items ?? []).flatMap((volume) => {
        if (!volume.id) return []

        const info = volume.volumeInfo ?? {}

        return [
          {
            id: volume.id,
            title: info.title ?? 'Unknown Title',
            authors: info.authors ?? [],
            coverUrl: this.pickBestCoverUrl(info.imageLinks),
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

    await setSearchCache(this.redisService, cacheKey, result)
    return result
  }

  async getById(id: string): Promise<BookDetail> {
    const bookId = id.trim()
    if (!bookId) {
      throw new NotFoundException('Book not found')
    }

    const cacheKey = `book:${bookId}`

    try {
      const cached = await this.redisService.get(cacheKey)
      if (cached) {
        return JSON.parse(cached) as BookDetail
      }
    } catch {
      void 0
    }

    const url = new URL(`${this.GOOGLE_BOOKS_API_URL}/volumes/${encodeURIComponent(bookId)}`)
    url.searchParams.set('key', this.configService.getOrThrow<string>('GOOGLE_BOOKS_API_KEY'))

    let raw: GoogleVolume

    try {
      raw = await ky.get(url.toString()).json<GoogleVolume>()
    } catch (error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        throw new NotFoundException('Book not found')
      }
      throw new InternalServerErrorException(
        `Google Books API error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }

    if (!raw.id) {
      throw new NotFoundException('Book not found')
    }

    const primaryAuthor = raw.volumeInfo?.authors?.[0]?.trim() ?? ''
    const moreByAuthor = primaryAuthor ? await this.fetchMoreByAuthor(primaryAuthor, raw.id) : []

    const result = this.mapBookDetail(raw, moreByAuthor)

    try {
      await this.redisService.set(
        cacheKey,
        JSON.stringify(result),
        'EX',
        this.BOOK_CACHE_TTL_SECONDS,
      )
    } catch {
      void 0
    }

    return result
  }

  private toHttpsUrl(url?: string): string | null {
    if (!url?.trim()) return null
    return url.replace(/^http:\/\//i, 'https://')
  }

  private pickBestCoverUrl(imageLinks?: GoogleImageLinks): string | null {
    if (!imageLinks) return null

    return (
      this.toHttpsUrl(imageLinks.extraLarge) ??
      this.toHttpsUrl(imageLinks.large) ??
      this.toHttpsUrl(imageLinks.medium) ??
      this.toHttpsUrl(imageLinks.small) ??
      this.toHttpsUrl(imageLinks.thumbnail) ??
      this.toHttpsUrl(imageLinks.smallThumbnail)
    )
  }

  private stripHtml(html?: string): string {
    if (!html?.trim()) return ''

    return html
      .replace(/<\s*br\s*\/?>/gi, '\n')
      .replace(/<\/\s*p\s*>/gi, '\n\n')
      .replace(/<\/\s*div\s*>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+\n/g, '\n')
      .trim()
  }

  private yearFromPublishedDate(publishedDate?: string) {
    if (!publishedDate?.trim()) return ''
    const match = publishedDate.trim().match(/^(\d{4})/)
    return match?.[1] ?? ''
  }

  private languageDisplay(code?: string) {
    if (!code?.trim()) return ''
    try {
      return new Intl.DisplayNames(['en'], { type: 'language' }).of(code) ?? code
    } catch {
      return code
    }
  }

  private escapeQueryValue(value: string) {
    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  }

  private pickIsbn(identifiers: GoogleIndustryIdentifier[] | undefined, type: string) {
    return identifiers?.find((item) => item.type === type)?.identifier?.trim() ?? ''
  }

  private mapRelated(volume: GoogleVolume, excludeId: string): BookRelatedItem | null {
    const id = volume.id?.trim()
    if (!id || id === excludeId) return null

    const info = volume.volumeInfo ?? {}
    const title = info.title?.trim()
    if (!title) return null

    return {
      id,
      title,
      coverUrl: this.pickBestCoverUrl(info.imageLinks),
      year: this.yearFromPublishedDate(info.publishedDate),
      rating: info.averageRating ?? null,
    }
  }

  private mapBookDetail(raw: GoogleVolume, moreByAuthor: BookRelatedItem[]): BookDetail {
    const info = raw.volumeInfo ?? {}
    const sale = raw.saleInfo ?? {}
    const access = raw.accessInfo ?? {}
    const identifiers = info.industryIdentifiers ?? []
    const authors = (info.authors ?? []).map((a) => a.trim()).filter(Boolean)
    const previewUrl =
      this.toHttpsUrl(info.previewLink) ?? this.toHttpsUrl(access.webReaderLink) ?? null
    const infoUrl =
      this.toHttpsUrl(info.canonicalVolumeLink) ?? this.toHttpsUrl(info.infoLink) ?? null

    return {
      id: raw.id ?? '',
      title: info.title?.trim() || 'Unknown Title',
      subtitle: info.subtitle?.trim() ?? '',
      authors,
      publisher: info.publisher?.trim() ?? '',
      publishedDate: info.publishedDate?.trim() ?? '',
      year: this.yearFromPublishedDate(info.publishedDate),
      description: this.stripHtml(info.description),
      pageCount: info.pageCount && info.pageCount > 0 ? info.pageCount : null,
      categories: (info.categories ?? []).map((c) => c.trim()).filter(Boolean),
      mainCategory: info.mainCategory?.trim() ?? '',
      language: this.languageDisplay(info.language),
      printType: info.printType?.trim() ?? '',
      isbn10: this.pickIsbn(identifiers, 'ISBN_10'),
      isbn13: this.pickIsbn(identifiers, 'ISBN_13'),
      googleRating: info.averageRating ?? null,
      googleRatingsCount: info.ratingsCount ?? 0,
      coverUrl: this.pickBestCoverUrl(info.imageLinks),
      previewUrl,
      infoUrl,
      buyUrl: this.toHttpsUrl(sale.buyLink),
      isEbook: Boolean(sale.isEbook),
      moreByAuthor,
      primaryAuthor: authors[0] ?? '',
    }
  }

  private async fetchMoreByAuthor(author: string, excludeId: string): Promise<BookRelatedItem[]> {
    const url = new URL(`${this.GOOGLE_BOOKS_API_URL}/volumes`)
    url.searchParams.set('q', `inauthor:"${this.escapeQueryValue(author)}"`)
    url.searchParams.set('printType', 'books')
    url.searchParams.set('maxResults', String(this.MORE_BY_AUTHOR_LIMIT))
    url.searchParams.set('orderBy', 'relevance')
    url.searchParams.set('key', this.configService.getOrThrow<string>('GOOGLE_BOOKS_API_KEY'))

    try {
      const response = await ky.get(url.toString()).json<GoogleBooksListResponse>()
      const items: BookRelatedItem[] = []
      const seen = new Set<string>([excludeId])

      for (const volume of response.items ?? []) {
        const mapped = this.mapRelated(volume, excludeId)
        if (!mapped || seen.has(mapped.id)) continue
        seen.add(mapped.id)
        items.push(mapped)
        if (items.length >= this.MORE_BY_AUTHOR_LIMIT) break
      }

      return items
    } catch {
      return []
    }
  }
}
