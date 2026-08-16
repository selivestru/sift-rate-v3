import { Controller, Get, Query } from '@nestjs/common'

import { FeedService } from './feed.service'
import { CurrentUser } from '~/common/decorators/current-user.decorator'
import { OptionalAuth } from '~/common/decorators/optional-auth.decorator'
import { OptionalCurrentUser } from '~/common/decorators/optional-current-user.decorator'
import { PaginationCursor } from '~/common/types/pagination-cursor.types'

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @OptionalAuth()
  @Get()
  getFeed(@Query() query?: PaginationCursor, @OptionalCurrentUser('userId') userId?: string) {
    return this.feedService.getFeed(userId, query?.cursor)
  }

  @Get('following')
  getFollowingFeed(@CurrentUser('userId') userId: string, @Query() query?: PaginationCursor) {
    return this.feedService.getFollowingFeed(userId, query?.cursor)
  }
}
