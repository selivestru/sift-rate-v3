import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { buildMediaPreview } from './utils/build-media-preview'
import { renderOgDocument } from './utils/render-og-document'
import { EnvConfig } from '~/app/config/env.config'
import { MediaLanguage } from '~/generated/prisma/enums'
import { MediaByIdParamsDto } from '~/modules/media/dto/media-by-id.params'
import { MediaService } from '~/modules/media/media.service'

@Injectable()
export class OgService {
  constructor(
    private readonly config: ConfigService<EnvConfig, true>,
    private readonly mediaService: MediaService,
  ) {}

  async renderDiscoverDocument(params: MediaByIdParamsDto, language: MediaLanguage) {
    const siteUrl = this.config.get('ORIGIN', { infer: true })
    const pageUrl = `${siteUrl}/discover/${params.mediaType.toLowerCase()}/${encodeURIComponent(params.externalId)}`

    const preview = await this.mediaService
      .getMediaById(params, language)
      .then((detail) => buildMediaPreview(params.mediaType, detail))
      .catch(() => null)

    return renderOgDocument({ preview, pageUrl, siteUrl })
  }
}
