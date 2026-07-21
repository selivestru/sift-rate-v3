import { InjectQueue } from '@nestjs/bullmq'
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'

import {
  POSTER_INGEST_JOB,
  POSTER_INGEST_QUEUE,
  PosterIngestJobData,
} from './constants/poster-queue'
import { MediaByIdParamsDto } from './dto/media-by-id.params'
import { SearchMediaQueryDto } from './dto/search-media.query'
import { AlbumService } from './services/album.service'
import { BookService } from './services/book.service'
import { GameService } from './services/game.service'
import { MovieService } from './services/movie.service'
import { TrackService } from './services/track.service'
import { TvShowService } from './services/tv_show.service'
import { MediaReviewsResponse, MediaSnapshot, MediaStateResponse } from './types/media.types'
import { Queue } from 'bullmq'
import { Media } from '~/generated/prisma/client'
import { MediaType, ReviewVisibility } from '~/generated/prisma/enums'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'

export type EnsureMediaResult = {
  media: Media
  inserted: boolean
}

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name)
  private readonly REVIEWS_LIMIT = 10

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(POSTER_INGEST_QUEUE)
    private readonly posterIngestQueue: Queue<PosterIngestJobData>,
    private readonly movieService: MovieService,
    private readonly tvShowService: TvShowService,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly gameService: GameService,
    private readonly bookService: BookService,
  ) {}

  searchMedia(mediaType: MediaType, query: SearchMediaQueryDto) {
    switch (mediaType) {
      case MediaType.MOVIE:
        return this.movieService.search(query)
      case MediaType.TV_SHOW:
        return this.tvShowService.search(query)
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

  getMediaById({ mediaType, externalId }: MediaByIdParamsDto) {
    switch (mediaType) {
      case MediaType.MOVIE:
        return this.movieService.getById(externalId)
      case MediaType.TV_SHOW:
        return this.tvShowService.getById(externalId)
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
        visibility: ReviewVisibility.PUBLIC,
      },
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: {
        createdAt: 'desc',
      },
      take: this.REVIEWS_LIMIT + 1,
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    const hasNextPage = reviews.length > this.REVIEWS_LIMIT

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

    const newMedia = await this.prisma.media.create({
      data: {
        externalId,
        mediaType,
        title: snapshot.title,
        posterUrl: snapshot.posterUrl,
      },
    })

    this.schedulePosterIngest(newMedia)

    return newMedia
  }

  async resolveMediaSnapshot(mediaType: MediaType, externalId: string): Promise<MediaSnapshot> {
    const detail = await this.getMediaById({ mediaType, externalId })
    return this.toSnapshot(mediaType, detail)
  }

  findByExternalId(mediaType: MediaType, externalId: string): Promise<Media | null> {
    return this.prisma.media.findUnique({
      where: {
        externalId_mediaType: { externalId, mediaType },
      },
    })
  }

  schedulePosterIngest(media: Media): void {
    if (!media.posterUrl) {
      return
    }

    this.posterIngestQueue
      .add(
        POSTER_INGEST_JOB,
        {
          mediaId: media.id,
          sourcePosterUrl: media.posterUrl,
        },
        {
          jobId: `poster:${media.id}`,
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
          removeOnComplete: true,
          removeOnFail: 100,
        },
      )
      .then(() => {
        this.logger.debug(
          `Poster ingest enqueued for media ${media.id} (${media.mediaType}/${media.externalId})`,
        )
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error)
        if (message.includes('Job is already') || message.includes('already exists')) {
          this.logger.debug(`Poster ingest already queued for media ${media.id}`)
          return
        }

        this.logger.warn(`Failed to enqueue poster ingest for media ${media.id}: ${message}`)
      })
  }

  private toSnapshot(
    mediaType: MediaType,
    detail: {
      title: string
      posterUrl?: string | null
      coverUrl?: string | null
    },
  ): MediaSnapshot {
    if (!detail.title) {
      throw new InternalServerErrorException('Media detail is missing title')
    }

    switch (mediaType) {
      case MediaType.MOVIE:
      case MediaType.TV_SHOW:
        return {
          title: detail.title,
          posterUrl: detail.posterUrl ?? null,
        }
      case MediaType.GAME:
      case MediaType.BOOK:
      case MediaType.ALBUM:
      case MediaType.TRACK:
        return {
          title: detail.title,
          posterUrl: detail.coverUrl ?? null,
        }
      default:
        throw new BadRequestException('Invalid media type')
    }
  }
}
