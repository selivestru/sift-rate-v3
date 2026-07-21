import { Body, Controller, Delete, Get, Param, Patch, Put, Query } from '@nestjs/common'

import { ReviewsQueryDto } from './dto/reviews.query'
import { UpdateReviewDto } from './dto/update-review.dto'
import { UpsertReviewDto } from './dto/upsert-review.dto'
import { ReviewService } from './review.service'
import { CurrentUser } from '~/common/decorators/current-user.decorator'

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('me')
  findMine(@CurrentUser('userId') userId: string, @Query() query: ReviewsQueryDto) {
    return this.reviewService.findMine(userId, query)
  }

  @Put()
  upsertReview(@CurrentUser('userId') userId: string, @Body() dto: UpsertReviewDto) {
    return this.reviewService.upsertReview(userId, dto)
  }

  @Patch(':id')
  updateReview(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewService.updateReview(userId, id, dto)
  }

  @Delete(':id')
  deleteReview(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.reviewService.deleteReview(userId, id)
  }
}
