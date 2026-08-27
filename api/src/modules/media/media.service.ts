import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'

import { MediaByIdParamsDto } from './dto/media-by-id.params'
import { SearchMediaQueryDto } from './dto/search-media.query'
import { AlbumService } from './services/album.service'
import { BookService } from './services/book.service'
import { GameService } from './services/game.service'
import { MovieService } from './services/movie.service'
import { TrackService } from './services/track.service'
import { TvShowService } from './services/tv_show.service'
import type {
  AlbumMetadata,
  MovieMetadata,
  TrackMetadata,
  TvShowMetadata,
} from './types/media-metadata.types'
import { MediaReviewsResponse, MediaSnapshot, MediaStateResponse } from './types/media.types'
import { AUTHOR_SELECT } from '~/common/constants/author-select'
import { DEFAULT_PAGE_SIZE } from '~/common/constants/pagination'
import { DEFAULT_MEDIA_LANGUAGE } from '~/common/decorators/current-language.decorator'
import type { MediaLanguage } from '~/common/decorators/current-language.decorator'
import { Media, Prisma } from '~/generated/prisma/client'
import { MediaType } from '~/generated/prisma/enums'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'

export type EnsureMediaResult = {
  media: Media
  inserted: boolean
}

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly movieService: MovieService,
    private readonly tvShowService: TvShowService,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly gameService: GameService,
    private readonly bookService: BookService,
  ) {}

  searchMedia(mediaType: MediaType, query: SearchMediaQueryDto, language: MediaLanguage) {
    switch (mediaType) {
      case MediaType.MOVIE:
        return this.movieService.search(query, language)
      case MediaType.TV_SHOW:
        return this.tvShowService.search(query, language)
      case MediaType.TRACK:
        return this.trackService.search(query)
      case MediaType.ALBUM:
        return this.albumService.search(query)
      case MediaType.GAME:
        return this.gameService.search(query)
      case MediaType.BOOK:
        return this.bookService.search(query)
      default:
        throw new BadRequestException('Invalid media type')
    }
  }

  getMediaById({ mediaType, externalId }: MediaByIdParamsDto, language: MediaLanguage) {
    switch (mediaType) {
      case MediaType.MOVIE:
        return this.movieService.getById(externalId, language)
      case MediaType.TV_SHOW:
        return this.tvShowService.getById(externalId, language)
      case MediaType.TRACK:
        return this.trackService.getById(externalId)
      case MediaType.ALBUM:
        return this.albumService.getById(externalId)
      case MediaType.GAME:
        return this.gameService.getById(externalId)
      case MediaType.BOOK:
        return this.bookService.getById(externalId)
      default:
        throw new BadRequestException('Invalid media type')
    }
  }

  async getMediaState(
    userId: string,
    { mediaType, externalId }: MediaByIdParamsDto,
  ): Promise<MediaStateResponse> {
    const media = await this.prisma.media.findUnique({
      where: {
        externalId_mediaType: {
          externalId,
          mediaType,
        },
      },
    })

    if (!media) {
      return {
        review: null,
        plannedItem: null,
      }
    }

    const [review, plannedItem] = await Promise.all([
      this.prisma.review.findFirst({
        where: {
          mediaId: media.id,
          userId,
        },
        include: { media: true },
      }),
      this.prisma.plannedItem.findFirst({
        where: {
          mediaId: media.id,
          userId,
        },
        include: { media: true },
      }),
    ])

    return {
      review,
      plannedItem,
    }
  }

  async getMediaReviews(
    params: MediaByIdParamsDto,
    cursor?: string,
  ): Promise<MediaReviewsResponse> {
    const media = await this.prisma.media.findUnique({
      where: {
        externalId_mediaType: params,
      },
    })

    if (!media) {
      return {
        data: [],
        nextCursor: null,
      }
    }

    const reviews = await this.prisma.review.findMany({
      where: {
        mediaId: media.id,
      },
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: DEFAULT_PAGE_SIZE + 1,
      include: {
        user: {
          select: AUTHOR_SELECT,
        },
      },
    })

    const hasNextPage = reviews.length > DEFAULT_PAGE_SIZE

    if (hasNextPage) {
      reviews.pop()
    }

    return {
      data: reviews,
      nextCursor: hasNextPage ? reviews[reviews.length - 1].id : null,
    }
  }

  async ensureMedia(mediaType: MediaType, externalId: string): Promise<Media> {
    const existingMedia = await this.findByExternalId(mediaType, externalId)

    if (existingMedia) {
      return existingMedia
    }

    const snapshot = await this.resolveMediaSnapshot(mediaType, externalId)

    const imdbId = this.getSnapshotImdbId(snapshot)

    const newMedia = await this.prisma.media.create({
      data: {
        externalId,
        mediaType,
        title: snapshot.title,
        posterUrl: snapshot.posterUrl,
        metadata: snapshot.metadata ? (snapshot.metadata as Prisma.InputJsonValue) : undefined,
        imdbId,
      },
    })

    return newMedia
  }

  async resolveMediaSnapshot(mediaType: MediaType, externalId: string): Promise<MediaSnapshot> {
    const detail = await this.getMediaById({ mediaType, externalId }, DEFAULT_MEDIA_LANGUAGE)
    return this.toSnapshot(mediaType, detail)
  }

  findByExternalId(mediaType: MediaType, externalId: string): Promise<Media | null> {
    return this.prisma.media.findUnique({
      where: {
        externalId_mediaType: { externalId, mediaType },
      },
    })
  }

  findByImdbId(imdbId: string): Promise<Media | null> {
    return this.prisma.media.findUnique({
      where: { imdbId },
    })
  }

  private getSnapshotImdbId(snapshot: MediaSnapshot): string | null {
    const imdbId =
      snapshot.metadata && 'imdbId' in snapshot.metadata ? snapshot.metadata.imdbId : null
    return typeof imdbId === 'string' && imdbId.length > 0 ? imdbId : null
  }

  private toSnapshot(
    mediaType: MediaType,
    detail: {
      title: string
      originalTitle?: string | null
      posterUrl?: string | null
      coverUrl?: string | null
      spotifyUrl?: string | null
      imdbId?: string | null
      kinopoiskId?: string | null
    },
  ): MediaSnapshot {
    if (!detail.title) {
      throw new InternalServerErrorException('Media detail is missing title')
    }

    switch (mediaType) {
      case MediaType.MOVIE:
      case MediaType.TV_SHOW: {
        const metadata: MovieMetadata | TvShowMetadata = {}

        if (detail.imdbId) {
          metadata.imdbId = detail.imdbId
        }

        if (detail.kinopoiskId) {
          metadata.kinopoiskId = detail.kinopoiskId
        }

        return {
          title: detail.originalTitle ?? detail.title,
          posterUrl: detail.posterUrl ?? null,
          metadata: Object.keys(metadata).length > 0 ? metadata : null,
        }
      }
      case MediaType.GAME:
      case MediaType.BOOK:
        return {
          title: detail.title,
          posterUrl: detail.coverUrl ?? null,
        }
      case MediaType.ALBUM:
      case MediaType.TRACK: {
        const spotifyMetadata: TrackMetadata | AlbumMetadata | null =
          typeof detail.spotifyUrl === 'string' && detail.spotifyUrl.length > 0
            ? { spotifyUrl: detail.spotifyUrl }
            : null

        return {
          title: detail.title,
          posterUrl: detail.coverUrl ?? null,
          metadata: spotifyMetadata,
        }
      }
      default:
        throw new BadRequestException('Invalid media type')
    }
  }
}
