import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { Request } from 'express'
import { MediaLanguage } from '~/generated/prisma/enums'

export { MediaLanguage }

export const DEFAULT_MEDIA_LANGUAGE = MediaLanguage.EN

const LANGUAGE_LOCALE_MAP: Record<string, MediaLanguage> = {
  en: MediaLanguage.EN,
  ua: MediaLanguage.UK,
  uk: MediaLanguage.UK,
  ru: MediaLanguage.RU,
}

export const CurrentLanguage = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): MediaLanguage => {
    const request = ctx.switchToHttp().getRequest<Request>()
    const acceptLanguage = request.get('accept-language') ?? ''

    const primaryTag =
      acceptLanguage.split(',')[0]?.split(';')[0]?.split('-')[0]?.trim().toLowerCase() ?? ''

    return LANGUAGE_LOCALE_MAP[primaryTag] ?? DEFAULT_MEDIA_LANGUAGE
  },
)
