import { MediaType } from '~/generated/prisma/enums'

export interface MovieMetadata {
  imdbId?: string
  kinopoiskId?: string
}

export interface TvShowMetadata {
  imdbId?: string
  kinopoiskId?: string
}

export interface TrackMetadata {
  spotifyUrl?: string
}

export interface AlbumMetadata {
  spotifyUrl?: string
}

export type GameMetadata = Record<string, never>

export type BookMetadata = Record<string, never>

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
