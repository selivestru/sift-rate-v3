import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'

import { ReviewsQueryDto } from './dto/reviews.query'
import { UpdateReviewDto } from './dto/update-review.dto'
import { UpsertReviewDto } from './dto/upsert-review.dto'
import { ReviewListResponse, ReviewResponse } from './types/review.types'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'
import { MediaService } from '~/modules/media/media.service'
import { MediaSnapshot } from '~/modules/media/types/media.types'

@Injectable()
export class ReviewService {
  private readonly REVIEWS_LIMIT = 10

  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  async findMine(userId: string, query: ReviewsQueryDto): Promise<ReviewListResponse> {
    const reviews = await this.prisma.review.findMany({
      where: {
        userId,
        ...(query.q && {
          media: {
            title: {
              contains: query.q,
              mode: 'insensitive',
            },
          },
        }),
      },
      ...(query.cursor && {
        cursor: { id: query.cursor },
        skip: 1,
      }),
      orderBy: {
        createdAt: 'desc',
      },
      take: this.REVIEWS_LIMIT + 1,
      include: { media: true },
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

  async updateReview(
    userId: string,
    reviewId: string,
    dto: UpdateReviewDto,
  ): Promise<ReviewResponse> {
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

  async upsertReview(userId: string, dto: UpsertReviewDto): Promise<ReviewResponse> {
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

      const review = await tx.review.upsert({
        where: {
          userId_mediaId: {
            userId,
            mediaId: media.id,
          },
        },
        create: {
          userId,
          mediaId: media.id,
          rating: dto.rating,
          content: dto.content ?? null,
          visibility: dto.visibility,
          hasSpoiler: dto.hasSpoiler,
        },
        update: {
          rating: dto.rating,
          content: dto.content,
          visibility: dto.visibility,
          hasSpoiler: dto.hasSpoiler,
        },
        include: { media: true },
      })

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

  async deleteReview(userId: string, reviewId: string): Promise<ReviewResponse> {
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
