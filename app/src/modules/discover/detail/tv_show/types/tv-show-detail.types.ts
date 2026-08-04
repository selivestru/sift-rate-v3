import type { MediaImage, MediaPerson, MediaSimilarItem, MediaVideo } from '../../shared'

export type TvShowPerson = MediaPerson
export type TvShowVideo = MediaVideo
export type TvShowImage = MediaImage
export type TvShowSimilarItem = MediaSimilarItem

export interface TvSeasonSummary {
  seasonNumber: number
  name: string
  overview: string
  airDate: string
  episodeCount: number
  posterUrl: string | null
  imdbRating: number
}

export interface TvShowDetail {
  id: string
  title: string
  originalTitle: string
  tagline: string
  overview: string
  firstAirDate: string
  lastAirDate: string
  yearStart: string
  yearEnd: string
  status: string
  type: string
  inProduction: boolean
  seasonCount: number
  episodeCount: number
  genres: string[]
  imdbRating: number
  imdbVoteCount: number
  posterUrl: string | null
  backdropUrl: string | null
  networks: string[]
  languages: string[]
  countries: string[]
  studios: string[]
  createdBy: string[]
  episodeRunTimeMinutes: number | null
  seasons: TvSeasonSummary[]
  cast: TvShowPerson[]
  videos: TvShowVideo[]
  backdrops: TvShowImage[]
  posters: TvShowImage[]
  similar: TvShowSimilarItem[]
}
