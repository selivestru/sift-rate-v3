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
  rating: number
  genres: string[]
  overview: string
}
