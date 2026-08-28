import type { MediaLocalizationSnapshot } from '../types/media-localization.types'
import { Media, Prisma } from '~/generated/prisma/client'
import { MediaLanguage, MediaType } from '~/generated/prisma/enums'

export const LOCALIZABLE_MEDIA_TYPES = [MediaType.MOVIE, MediaType.TV_SHOW] as const

export type LocalizableMediaType = (typeof LOCALIZABLE_MEDIA_TYPES)[number]

export const MEDIA_LANGUAGES = [MediaLanguage.EN, MediaLanguage.UK, MediaLanguage.RU] as const

export const TMDB_LANGUAGE: Record<MediaLanguage, 'en-US' | 'uk-UA' | 'ru-RU'> = {
  [MediaLanguage.EN]: 'en-US',
  [MediaLanguage.UK]: 'uk-UA',
  [MediaLanguage.RU]: 'ru-RU',
}

export const TMDB_ISO_639_1: Record<MediaLanguage, 'en' | 'uk' | 'ru'> = {
  [MediaLanguage.EN]: 'en',
  [MediaLanguage.UK]: 'uk',
  [MediaLanguage.RU]: 'ru',
}

export const isLocalizableMediaType = (mediaType: MediaType): mediaType is LocalizableMediaType => {
  return mediaType === MediaType.MOVIE || mediaType === MediaType.TV_SHOW
}

export const toTmdbLanguage = (language: MediaLanguage): (typeof TMDB_LANGUAGE)[MediaLanguage] => {
  return TMDB_LANGUAGE[language]
}

export const isMediaRecord = (value: unknown): value is Media => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const record = value as Record<string, unknown>
  return (
    typeof record.id === 'string' &&
    typeof record.externalId === 'string' &&
    typeof record.title === 'string' &&
    typeof record.mediaType === 'string' &&
    Object.values(MediaType).includes(record.mediaType as MediaType) &&
    'posterUrl' in record
  )
}

export const localizeMediaFields = (
  media: Media,
  translation: Pick<MediaLocalizationSnapshot, 'title' | 'posterUrl'> | undefined,
): Media => {
  if (!isLocalizableMediaType(media.mediaType)) {
    return media
  }

  return {
    ...media,
    title: translation?.title ?? media.title,
    posterUrl: translation?.posterUrl ?? media.posterUrl,
  }
}

export const collectMediaRecords = (
  value: unknown,
  acc: Map<string, Media> = new Map(),
  seen: Set<object> = new Set(),
): Map<string, Media> => {
  if (!value || typeof value !== 'object') {
    return acc
  }

  if (seen.has(value)) {
    return acc
  }

  seen.add(value)

  if (value instanceof Date) {
    return acc
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectMediaRecords(item, acc, seen)
    }
    return acc
  }

  if (isMediaRecord(value)) {
    acc.set(value.id, value)
    return acc
  }

  for (const nested of Object.values(value)) {
    collectMediaRecords(nested, acc, seen)
  }

  return acc
}

export const replaceMediaRecords = <T>(
  value: T,
  localizedById: ReadonlyMap<string, Media>,
  seen: WeakMap<object, unknown> = new WeakMap(),
): T => {
  if (!value || typeof value !== 'object') {
    return value
  }

  if (value instanceof Date) {
    return value
  }

  const cached = seen.get(value)
  if (cached) {
    return cached as T
  }

  if (Array.isArray(value)) {
    const next: unknown[] = []
    seen.set(value, next)

    for (const item of value) {
      next.push(replaceMediaRecords(item, localizedById, seen))
    }

    return next as T
  }

  if (isMediaRecord(value)) {
    const next = localizedById.get(value.id) ?? value
    seen.set(value, next)
    return next as T
  }

  const next: Record<string, unknown> = {}
  seen.set(value, next)

  for (const [key, nested] of Object.entries(value)) {
    next[key] = replaceMediaRecords(nested, localizedById, seen)
  }

  return next as T
}

export const buildLocalizedTitleFilter = (
  q: string,
  mediaType?: MediaType,
): Prisma.MediaWhereInput => {
  const titleContains = {
    contains: q,
    mode: 'insensitive' as const,
  }

  if (mediaType && !isLocalizableMediaType(mediaType)) {
    return {
      mediaType,
      title: titleContains,
    }
  }

  const crossLanguage = {
    OR: [
      { title: titleContains },
      {
        translations: {
          some: {
            title: titleContains,
          },
        },
      },
    ],
  }

  if (mediaType) {
    return {
      mediaType,
      ...crossLanguage,
    }
  }

  return {
    OR: [
      {
        mediaType: { notIn: [...LOCALIZABLE_MEDIA_TYPES] },
        title: titleContains,
      },
      {
        mediaType: { in: [...LOCALIZABLE_MEDIA_TYPES] },
        ...crossLanguage,
      },
    ],
  }
}
