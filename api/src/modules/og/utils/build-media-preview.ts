import type { MediaDetail, OgPreview } from '../types/og.types'
import { MediaType } from '~/generated/prisma/enums'
import type { AlbumDetail } from '~/modules/media/types/album.types'
import type { BookDetail } from '~/modules/media/types/book.types'
import type { GameDetail } from '~/modules/media/types/game.types'
import type { MovieDetail } from '~/modules/media/types/movie.types'
import type { TrackDetail } from '~/modules/media/types/track.types'
import type { TvShowDetail } from '~/modules/media/types/tv-show.types'

const MAX_DESCRIPTION_LENGTH = 200

const FALLBACK_DESCRIPTION = 'Your media life archive'

const OG_TYPES: Record<MediaType, string> = {
  MOVIE: 'video.movie',
  TV_SHOW: 'video.tv_show',
  BOOK: 'book',
  GAME: 'website',
  ALBUM: 'website',
  TRACK: 'website',
}

const truncate = (value: string) => {
  const text = value.trim().replace(/\s+/g, ' ')

  if (text.length <= MAX_DESCRIPTION_LENGTH) {
    return text
  }

  const cut = text.slice(0, MAX_DESCRIPTION_LENGTH)
  const lastSpace = cut.lastIndexOf(' ')

  return `${lastSpace > 0 ? cut.slice(0, lastSpace) : cut}…`
}

const withYear = (title: string, year: string | null | undefined) =>
  year ? `${title} (${year})` : title

const buildDescription = (meta: Array<string | null | undefined>, text?: string | null) => {
  const head = meta.filter((part): part is string => Boolean(part)).join(' · ')
  const body = text?.trim() ? truncate(text) : null

  if (head && body) {
    return `${head} — ${body}`
  }

  return head || body || FALLBACK_DESCRIPTION
}

const yearSpan = (start: string, end: string) => {
  if (!start) {
    return null
  }

  if (!end || end === start) {
    return start
  }

  return `${start}–${end}`
}

export const buildMediaPreview = (mediaType: MediaType, detail: MediaDetail): OgPreview => {
  switch (mediaType) {
    case MediaType.MOVIE: {
      const movie = detail as MovieDetail

      return {
        title: withYear(movie.title, movie.year),
        description: buildDescription(
          ['Movie', movie.year, movie.genres.slice(0, 3).join(', ')],
          movie.overview,
        ),
        imageUrl: movie.backdropUrl ?? movie.posterUrl,
        type: OG_TYPES[mediaType],
      }
    }

    case MediaType.TV_SHOW: {
      const tvShow = detail as TvShowDetail

      return {
        title: withYear(tvShow.title, yearSpan(tvShow.yearStart, tvShow.yearEnd)),
        description: buildDescription(
          [
            'TV show',
            yearSpan(tvShow.yearStart, tvShow.yearEnd),
            tvShow.genres.slice(0, 3).join(', '),
          ],
          tvShow.overview,
        ),
        imageUrl: tvShow.backdropUrl ?? tvShow.posterUrl,
        type: OG_TYPES[mediaType],
      }
    }

    case MediaType.GAME: {
      const game = detail as GameDetail

      return {
        title: withYear(game.title, game.year),
        description: buildDescription(
          ['Game', game.year, game.genres.slice(0, 3).join(', ')],
          game.summary || game.storyline,
        ),
        imageUrl: game.heroImageUrl ?? game.coverUrl,
        type: OG_TYPES[mediaType],
      }
    }

    case MediaType.BOOK: {
      const book = detail as BookDetail

      return {
        title: withYear(book.title, book.year),
        description: buildDescription(
          ['Book', book.year, book.authors.slice(0, 2).join(', ')],
          book.description,
        ),
        imageUrl: book.coverUrl,
        type: OG_TYPES[mediaType],
      }
    }

    case MediaType.ALBUM: {
      const album = detail as AlbumDetail

      return {
        title: withYear(album.title, album.releaseDate.slice(0, 4)),
        description: buildDescription([
          'Album',
          album.artistName,
          album.releaseDate.slice(0, 4),
          album.genres.slice(0, 3).join(', '),
        ]),
        imageUrl: album.coverUrl,
        type: OG_TYPES[mediaType],
      }
    }

    case MediaType.TRACK: {
      const track = detail as TrackDetail

      return {
        title: track.title,
        description: buildDescription([
          'Track',
          track.artistName,
          track.album?.title,
          track.releaseDate.slice(0, 4),
        ]),
        imageUrl: track.coverUrl,
        type: OG_TYPES[mediaType],
      }
    }

    default:
      return {
        title: '',
        description: FALLBACK_DESCRIPTION,
        imageUrl: null,
        type: 'website',
      }
  }
}
