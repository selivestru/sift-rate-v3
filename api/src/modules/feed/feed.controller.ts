import { Controller, Get, Query } from '@nestjs/common'

import { FeedService } from './feed.service'
import { CurrentLanguage } from '~/common/decorators/current-language.decorator'
import { Public } from '~/common/decorators/public.decorator'
import { PaginationCursor } from '~/common/types/pagination-cursor.types'
import { MediaLanguage } from '~/generated/prisma/enums'

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Public()
  @Get()
  getFeed(@CurrentLanguage() language: MediaLanguage, @Query() query?: PaginationCursor) {
    return this.feedService.getFeed(language, query?.cursor)
  }
}
