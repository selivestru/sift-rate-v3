import type {
  MovieImage,
  MoviePerson,
  MovieSimilarItem,
  MovieVideo,
  TmdbCastRaw,
  TmdbCompany,
  TmdbCountry,
  TmdbExternalIdsRaw,
  TmdbGenre,
  TmdbImageRaw,
  TmdbLanguage,
  TmdbVideoRaw,
} from './movie.types'

export interface TvShowSearchResult {
  results: TvShowSearchRaw[]
  total_results: number
  total_pages: number
  page: number
}

export interface TvShowSearchRaw {
  id: number
  name: string
  poster_path: string | null
  first_air_date: string
  vote_average: number
  genre_ids: number[]
  overview: string
}

export interface TvShowSearchItem {
  id: string
  title: string
  year: string
  posterUrl: string | null
  rating: number | null
  genres: string[]
  overview: string
}

export interface TvSeasonSummary {
  seasonNumber: number
  name: string
  overview: string
  airDate: string
  episodeCount: number
  posterUrl: string | null
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
  imdbId: string | null
  kinopoiskId: string | null
  imdbRating: number | null
  imdbVoteCount: number | null
  posterUrl: string | null
  backdropUrl: string | null
  networks: string[]
  languages: string[]
  countries: string[]
  studios: string[]
  createdBy: string[]
  episodeRunTimeMinutes: number | null
  seasons: TvSeasonSummary[]
  cast: MoviePerson[]
  videos: MovieVideo[]
  backdrops: MovieImage[]
  posters: MovieImage[]
  similar: MovieSimilarItem[]
}

export interface TmdbNetwork {
  id: number
  name: string
}

export interface TmdbCreatedBy {
  id: number
  name: string
}

export interface TmdbSeasonRaw {
  season_number: number
  name: string
  overview: string
  air_date: string | null
  episode_count: number
  poster_path: string | null
  vote_average: number
}

export interface TmdbTvRecommendationRaw {
  id: number
  name: string
  poster_path: string | null
  first_air_date: string
  vote_average: number
}

export interface TmdbTvShowRaw {
  id: number
  name: string
  original_name: string
  tagline: string
  overview: string
  first_air_date: string
  last_air_date: string
  status: string
  type: string
  in_production: boolean
  number_of_seasons: number
  number_of_episodes: number
  genres: TmdbGenre[]
  vote_average: number
  vote_count: number
  poster_path: string | null
  backdrop_path: string | null
  episode_run_time: number[]
  networks: TmdbNetwork[]
  production_companies: TmdbCompany[]
  production_countries: TmdbCountry[]
  spoken_languages: TmdbLanguage[]
  created_by: TmdbCreatedBy[]
  seasons: TmdbSeasonRaw[]
  credits?: {
    cast: TmdbCastRaw[]
  }
  videos?: {
    results: TmdbVideoRaw[]
  }
  images?: {
    backdrops: TmdbImageRaw[]
    posters: TmdbImageRaw[]
  }
  recommendations?: {
    results: TmdbTvRecommendationRaw[]
  }
  external_ids?: TmdbExternalIdsRaw
}
