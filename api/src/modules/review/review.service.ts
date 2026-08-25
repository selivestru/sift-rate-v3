import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'

import { REVIEW_SORT, ReviewsQueryDto } from './dto/reviews.query'
import { UpdateReviewDto } from './dto/update-review.dto'
import { UpsertReviewDto } from './dto/upsert-review.dto'
import { ReviewItem, ReviewsResponse, ReviewStatsResponse } from './types/review.types'
import { DEFAULT_PAGE_SIZE } from '~/common/constants/pagination'
import { Prisma } from '~/generated/prisma/client'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'
import { MediaService } from '~/modules/media/media.service'
import { MediaSnapshot } from '~/modules/media/types/media.types'

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  async findMine(userId: string, query: ReviewsQueryDto): Promise<ReviewsResponse> {
    const mediaFilter: Prisma.MediaWhereInput = {
      ...(query.mediaType && { mediaType: query.mediaType }),
      ...(query.q && {
        title: {
          contains: query.q,
          mode: 'insensitive',
        },
      }),
    }
    const hasMediaFilter = Object.keys(mediaFilter).length > 0

    const reviews = await this.prisma.review.findMany({
      where: {
        userId,
        ...(query.rating != null && { rating: query.rating }),
        ...(hasMediaFilter && { media: mediaFilter }),
      },
      ...(query.cursor && {
        cursor: { id: query.cursor },
        skip: 1,
      }),
      orderBy:
        query.sort === REVIEW_SORT.OLDEST
          ? [{ createdAt: 'asc' }, { id: 'asc' }]
          : [{ createdAt: 'desc' }, { id: 'desc' }],
      take: DEFAULT_PAGE_SIZE + 1,
      include: { media: true },
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

  async getMineStats(userId: string): Promise<ReviewStatsResponse> {
    const [total, ratingGroups, mediaIdGroups] = await Promise.all([
      this.prisma.review.count({
        where: { userId },
      }),
      this.prisma.review.groupBy({
        by: ['rating'],
        where: { userId },
        _count: true,
      }),
      this.prisma.review.groupBy({
        by: ['mediaId'],
        where: { userId },
        _count: true,
      }),
    ])

    const byRating: ReviewStatsResponse['byRating'] = {}
    for (const group of ratingGroups) {
      byRating[group.rating] = group._count
    }

    const byMediaType: ReviewStatsResponse['byMediaType'] = {}

    if (mediaIdGroups.length > 0) {
      const mediaIds = mediaIdGroups.map((group) => group.mediaId)
      const mediaRows = await this.prisma.media.findMany({
        where: { id: { in: mediaIds } },
        select: { id: true, mediaType: true },
      })
      const mediaTypeById = new Map(mediaRows.map((row) => [row.id, row.mediaType]))

      for (const group of mediaIdGroups) {
        const mediaType = mediaTypeById.get(group.mediaId)
        if (!mediaType) continue
        byMediaType[mediaType] = (byMediaType[mediaType] ?? 0) + group._count
      }
    }

    return {
      total,
      byMediaType,
      byRating,
    }
  }

  async updateReview(userId: string, reviewId: string, dto: UpdateReviewDto): Promise<ReviewItem> {
    if (Object.values(dto).every((value) => value === undefined)) {
      throw new BadRequestException('No fields to update')
    }

    const existing = await this.prisma.review.findFirst({
      where: { id: reviewId, userId },
    })

    if (!existing) {
      throw new NotFoundException('Review not found')
    }

    const review = await this.prisma.review.update({
      where: { id: reviewId },
      data: dto,
      include: { media: true },
    })

    return review
  }

  async upsertReview(userId: string, dto: UpsertReviewDto): Promise<ReviewItem> {
    const existingMedia = await this.mediaService.findByExternalId(dto.mediaType, dto.externalId)

    let snapshot: MediaSnapshot

    if (existingMedia) {
      snapshot = {
        title: existingMedia.title,
        posterUrl: existingMedia.posterUrl,
      }
    } else {
      snapshot = await this.mediaService.resolveMediaSnapshot(dto.mediaType, dto.externalId)
    }

    if (!snapshot) {
      throw new InternalServerErrorException('Snapshot is required to create Media')
    }

    const { review, inserted } = await this.prisma.$transaction(async (tx) => {
      let media = await tx.media.findUnique({
        where: {
          externalId_mediaType: {
            externalId: dto.externalId,
            mediaType: dto.mediaType,
          },
        },
      })

      let inserted = false

      if (!media) {
        media = await tx.media.create({
          data: {
            externalId: dto.externalId,
            mediaType: dto.mediaType,
            title: snapshot.title,
            posterUrl: snapshot.posterUrl,
          },
        })

        inserted = true
      }

      const hasReview = await tx.review.findUnique({
        where: {
          userId_mediaId: {
            userId,
            mediaId: media.id,
          },
        },
      })

      let review: ReviewItem

      if (!hasReview) {
        review = await tx.review.create({
          data: {
            userId,
            mediaId: media.id,
            rating: dto.rating,
            content: dto.content ?? null,
          },
          include: { media: true },
        })
      } else {
        review = await tx.review.update({
          where: {
            userId_mediaId: {
              userId,
              mediaId: media.id,
            },
          },
          data: {
            rating: dto.rating,
            content: dto.content,
          },
          include: { media: true },
        })
      }

      await tx.plannedItem.deleteMany({
        where: {
          mediaId: media.id,
          userId: userId,
        },
      })

      return { review, inserted }
    })

    if (inserted) {
      this.mediaService.schedulePosterIngest(review.media)
    }

    return review
  }

  async deleteReview(userId: string, reviewId: string): Promise<ReviewItem> {
    const review = await this.prisma.review.findFirst({
      where: { id: reviewId, userId },
    })

    if (!review) {
      throw new NotFoundException('Review not found')
    }

    return await this.prisma.review.delete({
      where: { id: review.id },
      include: { media: true },
    })
  }
}
