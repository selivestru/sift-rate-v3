import { getIntlayer } from 'intlayer'
import { useIntlayer } from 'react-intlayer'

import type { MediaType } from '../constants/media-type'
import { getCurrentLocale } from './locale'

const SINGULAR_KEYS = {
  MOVIE: 'MOVIE_ONE',
  TV_SHOW: 'TV_SHOW_ONE',
  GAME: 'GAME_ONE',
  BOOK: 'BOOK_ONE',
  ALBUM: 'ALBUM_ONE',
  TRACK: 'TRACK_ONE',
} as const

export const getMediaTypeLabel = (type: MediaType) => {
  return getIntlayer('media-type', getCurrentLocale())[type]
}

export const useMediaTypeLabel = (type: MediaType) => {
  const content = useIntlayer('media-type')
  return content[type].value
}

export const useMediaTypeSingularLabel = (type: MediaType) => {
  const content = useIntlayer('media-type')
  return content[SINGULAR_KEYS[type]].value
}

export const useMediaTypeLabels = () => {
  const content = useIntlayer('media-type')

  return {
    MOVIE: content.MOVIE.value,
    TV_SHOW: content.TV_SHOW.value,
    GAME: content.GAME.value,
    BOOK: content.BOOK.value,
    ALBUM: content.ALBUM.value,
    TRACK: content.TRACK.value,
  } as const satisfies Record<MediaType, string>
}
