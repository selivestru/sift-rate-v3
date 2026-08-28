import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

import { REVIEW_SORT, ReviewsQueryDto, ReviewsStatsQueryDto } from './dto/reviews.query'
import { UpdateReviewDto } from './dto/update-review.dto'
import { UpsertReviewDto } from './dto/upsert-review.dto'
import { ReviewItem, ReviewsResponse, ReviewStatsResponse } from './types/review.types'
import { getCreatedAtFilter } from './utils/getCreatedAtFilter'
import { DEFAULT_PAGE_SIZE } from '~/common/constants/pagination'
import { MediaLanguage } from '~/generated/prisma/enums'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'
import { MediaService } from '~/modules/media/media.service'
import { buildLocalizedTitleFilter } from '~/modules/media/utils/media-localization'

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  async findMine(
    userId: string,
    query: ReviewsQueryDto,
    language: MediaLanguage,
  ): Promise<ReviewsResponse> {
    const mediaFilter = this.buildMediaFilter(query)
    const createdAtFilter = getCreatedAtFilter(query?.year, query?.month)

    const reviews = await this.prisma.review.findMany({
      where: {
        userId,
        ...(query.rating != null && { rating: query.rating }),
        ...(createdAtFilter && { createdAt: createdAtFilter }),
        ...(mediaFilter && { media: mediaFilter }),
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

    const data = await this.mediaService.localizeMediaRelations(reviews, language)

    return {
      data,
      nextCursor: hasNextPage ? data[data.length - 1].id : null,
    }
  }

  async getMineStats(userId: string, query: ReviewsStatsQueryDto): Promise<ReviewStatsResponse> {
    const createdAtFilter = getCreatedAtFilter(query?.year, query?.month)

    const [total, ratingGroups, mediaIdGroups] = await Promise.all([
      this.prisma.review.count({
        where: {
          userId,
          ...(createdAtFilter && { createdAt: createdAtFilter }),
        },
      }),
      this.prisma.review.groupBy({
        by: ['rating'],
        where: {
          userId,
          ...(createdAtFilter && { createdAt: createdAtFilter }),
        },
        _count: true,
      }),
      this.prisma.review.groupBy({
        by: ['mediaId'],
        where: {
          userId,
          ...(createdAtFilter && { createdAt: createdAtFilter }),
        },
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

  async updateReview(
    userId: string,
    reviewId: string,
    dto: UpdateReviewDto,
    language: MediaLanguage,
  ): Promise<ReviewItem> {
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

    return this.mediaService.localizeMediaRelations(review, language)
  }

  async upsertReview(
    userId: string,
    dto: UpsertReviewDto,
    language: MediaLanguage,
    createdAt?: string,
  ): Promise<ReviewItem> {
    const media = await this.mediaService.ensureMedia(dto.mediaType, dto.externalId)

    const review = await this.prisma.$transaction(async (tx) => {
      const hasReview = await tx.review.findUnique({
        where: {
          userId_mediaId: {
            userId,
            mediaId: media.id,
          },
        },
      })

      const nextReview = hasReview
        ? await tx.review.update({
            where: {
              userId_mediaId: {
                userId,
                mediaId: media.id,
              },
            },
            data: {
              rating: dto.rating,
              content: dto.content,
              ...(createdAt && { createdAt: new Date(createdAt) }),
            },
            include: { media: true },
          })
        : await tx.review.create({
            data: {
              userId,
              mediaId: media.id,
              rating: dto.rating,
              content: dto.content ?? null,
              ...(createdAt && { createdAt: new Date(createdAt) }),
            },
            include: { media: true },
          })

      await tx.plannedItem.deleteMany({
        where: {
          mediaId: media.id,
          userId,
        },
      })

      return nextReview
    })

    return this.mediaService.localizeMediaRelations(review, language)
  }

  async deleteReview(
    userId: string,
    reviewId: string,
    language: MediaLanguage,
  ): Promise<ReviewItem> {
    const review = await this.prisma.review.findFirst({
      where: { id: reviewId, userId },
    })

    if (!review) {
      throw new NotFoundException('Review not found')
    }

    const deleted = await this.prisma.review.delete({
      where: { id: review.id },
      include: { media: true },
    })

    return this.mediaService.localizeMediaRelations(deleted, language)
  }

  private buildMediaFilter(query: ReviewsQueryDto) {
    if (query.q) {
      return buildLocalizedTitleFilter(query.q, query.mediaType)
    }

    if (query.mediaType) {
      return { mediaType: query.mediaType }
    }

    return undefined
  }
}
