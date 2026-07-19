import type { MediaType } from '~/common/constants/media-type'

export interface DiscoverSearchParams {
  q: string
  page: number
  pageSize: number
}

export interface DiscoverSearchPageResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
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

export interface TvSearchItem {
  id: string
  title: string
  year: string
  posterUrl: string | null
  rating: number
  genres: string[]
  overview: string
}

export interface TrackSearchItem {
  id: string
  title: string
  artist: string
  albumTitle: string
  coverUrl: string | null
  duration: number
  rank: number | null
}

export interface AlbumSearchItem {
  id: string
  title: string
  artist: string
  coverUrl: string | null
  nbTracks: number | null
}

export interface GameSearchItem {
  id: string
  title: string
  year: string
  coverUrl: string | null
  rating: number | null
  genres: string[]
  platforms: string[]
}

export interface BookSearchItem {
  id: string
  title: string
  authors: string[]
  coverUrl: string | null
  year: string
  pageCount: number | null
  categories: string[]
  rating: number | null
}

export interface DiscoverSearchConfig<T> {
  mediaType: MediaType
  title: string
  description: string
  searchPlaceholder: string
  resultsClassName: string
  skeletonCount: number
  pageSize: number
  queryKey: string[]
  queryFn: (params: DiscoverSearchParams) => Promise<DiscoverSearchPageResult<T>>
  Card: React.ComponentType<{ item: T }>
  Skeleton: React.ComponentType
  getItemKey: (item: T) => string
}
