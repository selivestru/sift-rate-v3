import { Body, Controller, Delete, Get, Param, Patch, Put, Query } from '@nestjs/common'

import { ReviewsQueryDto, ReviewsStatsQueryDto } from './dto/reviews.query'
import { UpdateReviewDto } from './dto/update-review.dto'
import { UpsertReviewDto } from './dto/upsert-review.dto'
import { ReviewService } from './review.service'
import { CurrentLanguage } from '~/common/decorators/current-language.decorator'
import { CurrentUser } from '~/common/decorators/current-user.decorator'
import { MediaLanguage } from '~/generated/prisma/enums'

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('me/stats')
  getMineStats(@CurrentUser('userId') userId: string, @Query() query: ReviewsStatsQueryDto) {
    return this.reviewService.getMineStats(userId, query)
  }

  @Get('me')
  findMine(
    @CurrentUser('userId') userId: string,
    @Query() query: ReviewsQueryDto,
    @CurrentLanguage() language: MediaLanguage,
  ) {
    return this.reviewService.findMine(userId, query, language)
  }

  @Put()
  upsertReview(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpsertReviewDto,
    @CurrentLanguage() language: MediaLanguage,
  ) {
    return this.reviewService.upsertReview(userId, dto, language)
  }

  @Patch(':id')
  updateReview(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
    @CurrentLanguage() language: MediaLanguage,
  ) {
    return this.reviewService.updateReview(userId, id, dto, language)
  }

  @Delete(':id')
  deleteReview(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @CurrentLanguage() language: MediaLanguage,
  ) {
    return this.reviewService.deleteReview(userId, id, language)
  }
}
