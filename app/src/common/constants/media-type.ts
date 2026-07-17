import {
  BookOpenIcon,
  ClapperboardIcon,
  Disc3Icon,
  Gamepad2Icon,
  Music2Icon,
  TvIcon,
  type LucideIcon,
} from 'lucide-react'

export const MEDIA_TYPES = {
  MOVIE: 'MOVIE',
  TV_SHOW: 'TV_SHOW',
  GAME: 'GAME',
  BOOK: 'BOOK',
  ALBUM: 'ALBUM',
  TRACK: 'TRACK',
} as const

export type MediaType = (typeof MEDIA_TYPES)[keyof typeof MEDIA_TYPES]

export interface MediaTypeMeta {
  type: MediaType
  label: string
  icon: LucideIcon
  color: string
}

export const mediaTypeMeta: Record<MediaType, MediaTypeMeta> = {
  MOVIE: {
    type: MEDIA_TYPES.MOVIE,
    label: 'Movies',
    icon: ClapperboardIcon,
    color: '#A78BFA',
  },
  TV_SHOW: {
    type: MEDIA_TYPES.TV_SHOW,
    label: 'TV Shows',
    icon: TvIcon,
    color: '#22D3EE',
  },
  GAME: {
    type: MEDIA_TYPES.GAME,
    label: 'Games',
    icon: Gamepad2Icon,
    color: '#34D399',
  },
  BOOK: {
    type: MEDIA_TYPES.BOOK,
    label: 'Books',
    icon: BookOpenIcon,
    color: '#FBBF24',
  },
  ALBUM: {
    type: MEDIA_TYPES.ALBUM,
    label: 'Albums',
    icon: Disc3Icon,
    color: '#F472B6',
  },
  TRACK: {
    type: MEDIA_TYPES.TRACK,
    label: 'Tracks',
    icon: Music2Icon,
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
