import { Controller, Get, Header, Param } from '@nestjs/common'
import { SkipThrottle } from '@nestjs/throttler'

import { OgService } from './og.service'
import { CurrentLanguage } from '~/common/decorators/current-language.decorator'
import { Public } from '~/common/decorators/public.decorator'
import { MediaLanguage } from '~/generated/prisma/enums'
import { MediaByIdParamsDto } from '~/modules/media/dto/media-by-id.params'

@Controller('og')
export class OgController {
  constructor(private readonly ogService: OgService) {}

  @Public()
  @SkipThrottle()
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=600')
  @Get('discover/:mediaType/:externalId')
  getDiscoverDocument(
    @Param() params: MediaByIdParamsDto,
    @CurrentLanguage() language: MediaLanguage,
  ) {
    return this.ogService.renderDiscoverDocument(params, language)
  }

  @Public()
  @SkipThrottle()
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=600')
  @Get('profile/:username')
  getProfileDocument(@Param('username') username: string) {
    return this.ogService.renderProfileDocument(username)
  }
}
