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
  externalId: string
  title: string
  year?: number
  posterUrl?: string | null
}

export interface TvSearchItem {
  externalId: string
  title: string
  year?: number
  posterUrl?: string | null
}

export interface GameSearchItem {
  externalId: string
  title: string
  year?: number
  coverUrl?: string | null
}

export interface BookSearchItem {
  externalId: string
  title: string
  author?: string
  year?: number
  coverUrl?: string | null
}

export interface AlbumSearchItem {
  externalId: string
  title: string
  artist?: string
  year?: number
  coverUrl?: string | null
}

export interface TrackSearchItem {
  externalId: string
  title: string
  artist?: string
  album?: string
  durationSec?: number
  coverUrl?: string | null
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
