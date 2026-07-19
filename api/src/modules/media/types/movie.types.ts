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
