import { api } from '~/common/api'

import type {
  AlbumSearchItem,
  BookSearchItem,
  DiscoverSearchPageResult,
  DiscoverSearchParams,
  GameSearchItem,
  MovieSearchItem,
  TrackSearchItem,
  TvSearchItem,
} from '../components/search/types/discover-search.types'

const search = async <T>(params: DiscoverSearchParams): Promise<DiscoverSearchPageResult<T>> => {
  const searchParams = new URLSearchParams()

  searchParams.set('q', params.q)
  searchParams.set('page', String(params.page))

  return api<DiscoverSearchPageResult<T>>(`/media/${params.slug}`, {
    searchParams,
  }).json()
}

export const discoverApi = {
  searchMovies: (params: DiscoverSearchParams) => search<MovieSearchItem>(params),
  searchTvShows: (params: DiscoverSearchParams) => search<TvSearchItem>(params),
  searchGames: (params: DiscoverSearchParams) => search<GameSearchItem>(params),
  searchBooks: (params: DiscoverSearchParams) => search<BookSearchItem>(params),
  searchAlbums: (params: DiscoverSearchParams) => search<AlbumSearchItem>(params),
  searchTracks: (params: DiscoverSearchParams) => search<TrackSearchItem>(params),
}
