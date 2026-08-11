import { MediaType } from '~/generated/prisma/enums'

export interface MovieMetadata {
  watchUrl?: string
  releaseYear?: number
  runtimeMinutes?: number
  director?: string
  genres?: string[]
}

export interface TvShowMetadata {
  watchUrl?: string
  yearStart?: number
  yearEnd?: number
  seasonCount?: number
  episodeCount?: number
  genres?: string[]
}

export interface TrackMetadata {
  audioUrl?: string
  durationSeconds?: number
  artistName?: string
  albumTitle?: string
  releaseDate?: string
}

export interface AlbumMetadata {
  artistName?: string
  releaseDate?: string
  trackCount?: number
  genres?: string[]
  label?: string
}

export interface GameMetadata {
  releaseYear?: number
  developers?: string[]
  publishers?: string[]
  platforms?: string[]
  genres?: string[]
}

export interface BookMetadata {
  authors?: string[]
  publishedYear?: number
  pageCount?: number
  publisher?: string
  categories?: string[]
  isbn13?: string
}

export interface MediaMetadataMap {
  [MediaType.MOVIE]: MovieMetadata
  [MediaType.TV_SHOW]: TvShowMetadata
  [MediaType.TRACK]: TrackMetadata
  [MediaType.ALBUM]: AlbumMetadata
  [MediaType.GAME]: GameMetadata
  [MediaType.BOOK]: BookMetadata
}

export type MediaMetadata = MediaMetadataMap[MediaType]

export type MetadataFor<T extends MediaType> = MediaMetadataMap[T]
