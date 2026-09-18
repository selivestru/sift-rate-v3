import type { AlbumDetail } from '~/modules/media/types/album.types'
import type { BookDetail } from '~/modules/media/types/book.types'
import type { GameDetail } from '~/modules/media/types/game.types'
import type { MovieDetail } from '~/modules/media/types/movie.types'
import type { TrackDetail } from '~/modules/media/types/track.types'
import type { TvShowDetail } from '~/modules/media/types/tv-show.types'

export type MediaDetail =
  MovieDetail | TvShowDetail | TrackDetail | AlbumDetail | GameDetail | BookDetail

export interface OgPreview {
  title: string
  description: string
  imageUrl: string | null
  type: string
}
