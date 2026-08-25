import { Controller, Get, Query } from '@nestjs/common'

import { FeedService } from './feed.service'
import { Public } from '~/common/decorators/public.decorator'
import { PaginationCursor } from '~/common/types/pagination-cursor.types'

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Public()
  @Get()
  getFeed(@Query() query?: PaginationCursor) {
    return this.feedService.getFeed(query?.cursor)
  }
}
