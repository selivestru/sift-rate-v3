import { MediaType } from '~/generated/prisma/enums'

export interface TmdbFindMovieResult {
  id: number
  title: string
  poster_path: string | null
  media_type?: string
}

export interface TmdbFindTvResult {
  id: number
  name: string
  poster_path: string | null
  media_type?: string
}

export interface TmdbFindResponse {
  movie_results: TmdbFindMovieResult[]
  tv_results: TmdbFindTvResult[]
}

export interface TmdbFindMatch {
  externalId: string
  mediaType: MediaType
  title: string
  posterUrl: string | null
}
