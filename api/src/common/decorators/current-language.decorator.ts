import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { Request } from 'express'

export type MediaLanguage = 'en-US' | 'uk-UA' | 'ru-RU'

export const DEFAULT_MEDIA_LANGUAGE: MediaLanguage = 'en-US'

const LANGUAGE_LOCALE_MAP: Record<string, MediaLanguage> = {
  en: 'en-US',
  ua: 'uk-UA',
  uk: 'uk-UA',
  ru: 'ru-RU',
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
