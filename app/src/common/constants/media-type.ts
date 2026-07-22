import {
  BookOpen,
  Clapperboard,
  Gamepad2,
  MusicNote3,
  Tv,
  Vinyl,
  type IconComponent,
} from 'reicon-react'

import type { FileRoutesByTo } from '~/app/routeTree.gen'

export const MEDIA_TYPES = {
  MOVIE: 'MOVIE',
  TV_SHOW: 'TV_SHOW',
  GAME: 'GAME',
  BOOK: 'BOOK',
  ALBUM: 'ALBUM',
  TRACK: 'TRACK',
} as const

export type MediaType = (typeof MEDIA_TYPES)[keyof typeof MEDIA_TYPES]

export const MEDIA_TYPE_SLUGS = {
  movie: MEDIA_TYPES.MOVIE,
  tv_show: MEDIA_TYPES.TV_SHOW,
  game: MEDIA_TYPES.GAME,
  book: MEDIA_TYPES.BOOK,
  album: MEDIA_TYPES.ALBUM,
  track: MEDIA_TYPES.TRACK,
} as const

export type MediaTypeSlug = keyof typeof MEDIA_TYPE_SLUGS

export const mediaTypeToSlug = {
  [MEDIA_TYPES.MOVIE]: 'movie',
  [MEDIA_TYPES.TV_SHOW]: 'tv_show',
  [MEDIA_TYPES.GAME]: 'game',
  [MEDIA_TYPES.BOOK]: 'book',
  [MEDIA_TYPES.ALBUM]: 'album',
  [MEDIA_TYPES.TRACK]: 'track',
} as const satisfies Record<MediaType, MediaTypeSlug>

export const isMediaTypeSlug = (value: string): value is MediaTypeSlug => {
  return value in MEDIA_TYPE_SLUGS
}

export const getMediaTypeFromSlug = (slug: MediaTypeSlug): MediaType => {
  return MEDIA_TYPE_SLUGS[slug]
}

export interface MediaTypeMeta {
  type: MediaType
  label: string
  icon: IconComponent
  color: string
}

export const mediaTypeMeta: Record<MediaType, MediaTypeMeta> = {
  MOVIE: {
    type: MEDIA_TYPES.MOVIE,
    label: 'Movies',
    icon: Clapperboard,
    color: '#A78BFA',
  },
  TV_SHOW: {
    type: MEDIA_TYPES.TV_SHOW,
    label: 'TV Shows',
    icon: Tv,
    color: '#818CF8',
  },
  GAME: {
    type: MEDIA_TYPES.GAME,
    label: 'Games',
    icon: Gamepad2,
    color: '#34D399',
  },
  BOOK: {
    type: MEDIA_TYPES.BOOK,
    label: 'Books',
    icon: BookOpen,
    color: '#FBBF24',
  },
  ALBUM: {
    type: MEDIA_TYPES.ALBUM,
    label: 'Albums',
    icon: Vinyl,
    color: '#F472B6',
  },
  TRACK: {
    type: MEDIA_TYPES.TRACK,
    label: 'Tracks',
    icon: MusicNote3,
    color: '#60A5FA',
  },
}

export const mediaTypeList: MediaTypeMeta[] = [
  mediaTypeMeta.MOVIE,
  mediaTypeMeta.TV_SHOW,
  mediaTypeMeta.GAME,
  mediaTypeMeta.BOOK,
  mediaTypeMeta.ALBUM,
  mediaTypeMeta.TRACK,
]

export const mediaDetailRouteByType: Record<MediaType, keyof FileRoutesByTo> = {
  [MEDIA_TYPES.MOVIE]: '/discover/movie/$externalId',
  [MEDIA_TYPES.TV_SHOW]: '/discover/tv_show/$externalId',
  [MEDIA_TYPES.GAME]: '/discover/game/$externalId',
  [MEDIA_TYPES.BOOK]: '/discover/book/$externalId',
  [MEDIA_TYPES.ALBUM]: '/discover/album/$externalId',
  [MEDIA_TYPES.TRACK]: '/discover/track/$externalId',
} as const
