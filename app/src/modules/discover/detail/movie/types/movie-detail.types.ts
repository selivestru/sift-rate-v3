import type { MediaImage, MediaPerson, MediaSimilarItem, MediaVideo } from '../../shared'

export type MoviePerson = MediaPerson
export type MovieVideo = MediaVideo
export type MovieImage = MediaImage
export type MovieSimilarItem = MediaSimilarItem

export interface MovieCollectionPart {
  id: string
  title: string
  year: string
  posterUrl: string | null
  rating: number | null
}

export interface MovieCollection {
  id: string
  name: string
  parts: MovieCollectionPart[]
}

export interface MovieDetail {
  id: string
  title: string
  originalTitle: string
  tagline: string
  overview: string
  year: string
  releaseDate: string
  runtimeMinutes: number | null
  status: string
  genres: string[]
  kinopoiskId: string | null
  imdbRating: number
  imdbVoteCount: number
  posterUrl: string | null
  backdropUrl: string | null
  languages: string[]
  countries: string[]
  studios: string[]
  budget: number | null
  revenue: number | null
  cast: MoviePerson[]
  directors: MoviePerson[]
  writers: MoviePerson[]
  producers: MoviePerson[]
  videos: MovieVideo[]
  backdrops: MovieImage[]
  posters: MovieImage[]
  similar: MovieSimilarItem[]
  collection: MovieCollection | null
}
