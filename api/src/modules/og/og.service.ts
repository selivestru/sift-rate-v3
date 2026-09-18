import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import type { OgPreview } from './types/og.types'
import { buildMediaPreview } from './utils/build-media-preview'
import { buildProfilePreview } from './utils/build-profile-preview'
import { renderOgDocument } from './utils/render-og-document'
import { EnvConfig } from '~/app/config/env.config'
import { MediaLanguage } from '~/generated/prisma/enums'
import { MediaByIdParamsDto } from '~/modules/media/dto/media-by-id.params'
import { MediaService } from '~/modules/media/media.service'
import { UserService } from '~/modules/user/user.service'

@Injectable()
export class OgService {
  constructor(
    private readonly config: ConfigService<EnvConfig, true>,
    private readonly mediaService: MediaService,
    private readonly userService: UserService,
  ) {}

  async renderDiscoverDocument(params: MediaByIdParamsDto, language: MediaLanguage) {
    const pageUrl = this.buildPageUrl(
      `/discover/${params.mediaType.toLowerCase()}/${encodeURIComponent(params.externalId)}`,
    )

    const preview = await this.mediaService
      .getMediaById(params, language)
      .then((detail) => buildMediaPreview(params.mediaType, detail))
      .catch(() => null)

    return this.renderDocument(pageUrl, preview)
  }

  async renderProfileDocument(username: string) {
    const pageUrl = this.buildPageUrl(`/${encodeURIComponent(username)}`)

    const preview = await this.userService
      .getUserProfile(username)
      .then((profile) => buildProfilePreview(profile))
      .catch(() => null)

    return this.renderDocument(pageUrl, preview)
  }

  private buildPageUrl(path: string) {
    return `${this.config.get('ORIGIN', { infer: true })}${path}`
  }

  private renderDocument(pageUrl: string, preview: OgPreview | null) {
    return renderOgDocument({
      preview,
      pageUrl,
      siteUrl: this.config.get('ORIGIN', { infer: true }),
    })
  }
}
