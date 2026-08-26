import {
  IMDB_MOVIE_TITLE_TYPES,
  IMDB_TV_TITLE_TYPES,
  IMDB_UNSUPPORTED_TITLE_TYPES,
} from '../constants/imdb-import'
import { MediaType } from '~/generated/prisma/enums'

export const normalizeImdbTitleType = (value: string): string => {
  return value.toLowerCase().replace(/[\s_-]+/g, '')
}

export const isUnsupportedImdbTitleType = (titleType: string): boolean => {
  return IMDB_UNSUPPORTED_TITLE_TYPES.has(normalizeImdbTitleType(titleType))
}

export const mapImdbTitleType = (titleType: string): MediaType | null => {
  const normalized = normalizeImdbTitleType(titleType)

  if (IMDB_MOVIE_TITLE_TYPES.has(normalized)) {
    return MediaType.MOVIE
  }

  if (IMDB_TV_TITLE_TYPES.has(normalized)) {
    return MediaType.TV_SHOW
  }

  return null
}
