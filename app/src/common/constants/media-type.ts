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
  TRACK: 'TRACK',
  ALBUM: 'ALBUM',
  GAME: 'GAME',
  BOOK: 'BOOK',
} as const

export type MediaType = (typeof MEDIA_TYPES)[keyof typeof MEDIA_TYPES]

export const MEDIA_TYPE_SLUGS = {
  movie: MEDIA_TYPES.MOVIE,
  tv_show: MEDIA_TYPES.TV_SHOW,
  track: MEDIA_TYPES.TRACK,
  album: MEDIA_TYPES.ALBUM,
  game: MEDIA_TYPES.GAME,
  book: MEDIA_TYPES.BOOK,
} as const

export type MediaTypeSlug = keyof typeof MEDIA_TYPE_SLUGS

export const mediaTypeToSlug = {
  [MEDIA_TYPES.MOVIE]: 'movie',
  [MEDIA_TYPES.TV_SHOW]: 'tv_show',
  [MEDIA_TYPES.TRACK]: 'track',
  [MEDIA_TYPES.ALBUM]: 'album',
  [MEDIA_TYPES.GAME]: 'game',
  [MEDIA_TYPES.BOOK]: 'book',
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
  TRACK: {
    type: MEDIA_TYPES.TRACK,
    label: 'Tracks',
    icon: MusicNote3,
    color: '#60A5FA',
  },
  ALBUM: {
    type: MEDIA_TYPES.ALBUM,
    label: 'Albums',
    icon: Vinyl,
    color: '#F472B6',
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
}

export const mediaTypeList: MediaTypeMeta[] = [
  mediaTypeMeta.MOVIE,
  mediaTypeMeta.TV_SHOW,
  mediaTypeMeta.TRACK,
  mediaTypeMeta.ALBUM,
  mediaTypeMeta.GAME,
  mediaTypeMeta.BOOK,
]

export const mediaDetailRouteByType: Record<MediaType, keyof FileRoutesByTo> = {
  [MEDIA_TYPES.MOVIE]: '/discover/movie/$externalId',
  [MEDIA_TYPES.TV_SHOW]: '/discover/tv_show/$externalId',
  [MEDIA_TYPES.TRACK]: '/discover/track/$externalId',
  [MEDIA_TYPES.ALBUM]: '/discover/album/$externalId',
  [MEDIA_TYPES.GAME]: '/discover/game/$externalId',
  [MEDIA_TYPES.BOOK]: '/discover/book/$externalId',
} as const
