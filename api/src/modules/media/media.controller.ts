import { Controller, Get, Param, Query } from '@nestjs/common'

import { MediaByIdParamsDto } from './dto/media-by-id.params'
import { MediaTypeParamsDto } from './dto/media-search.params'
import { SearchMediaQueryDto } from './dto/search-media.query'
import { MediaService } from './media.service'
import { CurrentLanguage } from '~/common/decorators/current-language.decorator'
import { CurrentUser } from '~/common/decorators/current-user.decorator'
import { Public } from '~/common/decorators/public.decorator'
import { PaginationCursor } from '~/common/types/pagination-cursor.types'
import { MediaLanguage } from '~/generated/prisma/enums'

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Public()
  @Get(':mediaType')
  searchMedia(
    @Param() params: MediaTypeParamsDto,
    @Query() query: SearchMediaQueryDto,
    @CurrentLanguage() language: MediaLanguage,
  ) {
    return this.mediaService.searchMedia(params.mediaType, query, language)
  }

  @Public()
  @Get(':mediaType/:externalId')
  getMediaById(@Param() params: MediaByIdParamsDto, @CurrentLanguage() language: MediaLanguage) {
    return this.mediaService.getMediaById(params, language)
  }

  @Get(':mediaType/:externalId/state')
  getMediaState(
    @CurrentUser('userId') userId: string,
    @Param() params: MediaByIdParamsDto,
    @CurrentLanguage() language: MediaLanguage,
  ) {
    return this.mediaService.getMediaState(userId, params, language)
  }

  @Public()
  @Get(':mediaType/:externalId/reviews')
  getMediaReviews(@Param() params: MediaByIdParamsDto, @Query() query?: PaginationCursor) {
    return this.mediaService.getMediaReviews(params, query?.cursor)
  }
}
