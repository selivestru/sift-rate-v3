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

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const emptyResult = async <T>(
  params: DiscoverSearchParams,
): Promise<DiscoverSearchPageResult<T>> => {
  await sleep(2000)

  return {
    items: Array.from({ length: params.pageSize }, (_, index) => ({
      id: `${params.page}-${index + 1}`,
    })) as T[],
    total: 100,
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
