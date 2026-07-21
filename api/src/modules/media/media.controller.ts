import { Controller, Get, Param, Query } from '@nestjs/common'

import { MediaByIdParamsDto } from './dto/media-by-id.params'
import { MediaTypeParamsDto } from './dto/media-search.params'
import { SearchMediaQueryDto } from './dto/search-media.query'
import { MediaService } from './media.service'
import { CurrentUser } from '~/common/decorators/current-user.decorator'
import { Public } from '~/common/decorators/public.decorator'

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Public()
  @Get(':mediaType')
  searchMedia(@Param() params: MediaTypeParamsDto, @Query() query: SearchMediaQueryDto) {
    return this.mediaService.searchMedia(params.mediaType, query)
  }

  @Public()
  @Get(':mediaType/:externalId')
  getMediaById(@Param() params: MediaByIdParamsDto) {
    return this.mediaService.getMediaById(params)
  }

  @Get('state/:mediaType/:externalId')
  getMediaState(@CurrentUser('userId') userId: string, @Param() params: MediaByIdParamsDto) {
    return this.mediaService.getMediaState(userId, params)
  }

  @Public()
  @Get('reviews/:mediaType/:externalId')
  getMediaReviews(@Param() params: MediaByIdParamsDto, @Query('cursor') cursor?: string) {
    return this.mediaService.getMediaReviews(params, cursor)
  }
}
