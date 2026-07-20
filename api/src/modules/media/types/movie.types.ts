export interface MovieSearchResult {
  results: MovieSearchRaw[]
  total_results: number
  total_pages: number
  page: number
}

export interface MovieSearchRaw {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  vote_average: number
  genre_ids: number[]
  overview: string
}

export interface MovieSearchItem {
  id: string
  title: string
  year: string
  posterUrl: string | null
  rating: number
  genres: string[]
  overview: string
}

export type TmdbImageSize = 'w185' | 'w300' | 'w342' | 'w500' | 'w780' | 'w1280' | 'original'

export interface MoviePerson {
  id: string
  name: string
  profileUrl: string | null
  character?: string
  job?: string
}

export interface MovieVideo {
  id: string
  key: string
  name: string
}

export interface MovieImage {
  url: string
  thumbUrl: string
  width: number
  height: number
}

export interface MovieSimilarItem {
  id: string
  title: string
  year: string
  posterUrl: string | null
  rating: number
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
  tmdbRating: number
  tmdbVoteCount: number
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
}

export interface TmdbGenre {
  id: number
  name: string
}

export interface TmdbCompany {
  id: number
  name: string
}

export interface TmdbCountry {
  iso_3166_1: string
  name: string
}

export interface TmdbLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

export interface TmdbCastRaw {
  id: number
  name: string
  profile_path: string | null
  character: string
  order: number
}

export interface TmdbCrewRaw {
  id: number
  name: string
  profile_path: string | null
  job: string
  department: string
}

export interface TmdbVideoRaw {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}

export interface TmdbImageRaw {
  file_path: string
  width: number
  height: number
  vote_average: number
}

export interface TmdbRecommendationRaw {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  vote_average: number
}

export interface TmdbMovieDetailRaw {
  id: number
  title: string
  original_title: string
  tagline: string
  overview: string
  release_date: string
  runtime: number | null
  status: string
  genres: TmdbGenre[]
  vote_average: number
  vote_count: number
  poster_path: string | null
  backdrop_path: string | null
  budget: number
  revenue: number
  production_companies: TmdbCompany[]
  production_countries: TmdbCountry[]
  spoken_languages: TmdbLanguage[]
  credits?: {
    cast: TmdbCastRaw[]
    crew: TmdbCrewRaw[]
  }
  videos?: {
    results: TmdbVideoRaw[]
  }
  images?: {
    backdrops: TmdbImageRaw[]
    posters: TmdbImageRaw[]
  }
  recommendations?: {
    results: TmdbRecommendationRaw[]
  }
}
