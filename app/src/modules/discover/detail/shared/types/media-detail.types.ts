import type { MediaType } from '~/common/constants/media-type'

export interface MediaImage {
  url: string
  thumbUrl: string
  width: number
  height: number
}

export interface MediaVideo {
  id: string
  key: string
  name: string
}

export interface MediaSimilarItem {
  id: string
  title: string
  year: string
  posterUrl: string | null
  rating: number
}

export type SimilarMediaType = Extract<MediaType, 'MOVIE' | 'TV_SHOW' | 'GAME' | 'BOOK'>
