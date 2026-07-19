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

const emptyResult = async <T>(
  params: DiscoverSearchParams,
): Promise<DiscoverSearchPageResult<T>> => {
  return {
    items: [],
    total: 0,
    page: params.page,
    pageSize: params.pageSize,
  }
}

export const discoverApi = {
  searchMovies: (params: DiscoverSearchParams) => emptyResult<MovieSearchItem>(params),
  searchTvShows: (params: DiscoverSearchParams) => emptyResult<TvSearchItem>(params),
  searchGames: (params: DiscoverSearchParams) => emptyResult<GameSearchItem>(params),
  searchBooks: (params: DiscoverSearchParams) => emptyResult<BookSearchItem>(params),
  searchAlbums: (params: DiscoverSearchParams) => emptyResult<AlbumSearchItem>(params),
  searchTracks: (params: DiscoverSearchParams) => emptyResult<TrackSearchItem>(params),
}
