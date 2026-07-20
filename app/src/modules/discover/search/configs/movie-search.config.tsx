import { MEDIA_TYPES } from '~/common/constants/media-type'

import { discoverSearchApi } from '../api/discover-search.api'
import { MovieSearchCard } from '../components/movie/MovieSearchCard'
import { MovieSearchSkeleton } from '../components/movie/MovieSearchSkeleton'
import type { DiscoverSearchConfig, MovieSearchItem } from '../types/discover-search.types'

export const movieSearchConfig: DiscoverSearchConfig<MovieSearchItem> = {
  mediaType: MEDIA_TYPES.MOVIE,
  title: 'Find movies',
  description: 'Search films to watch and archive in your life timeline.',
  searchPlaceholder: 'Search movies…',
  skeletonCount: 6,
  pageSize: 10,
  resultsClassName: 'flex flex-col gap-3',
  queryKey: ['discover', 'search', 'movie'],
  queryFn: discoverSearchApi.searchMovies,
  Card: MovieSearchCard,
  Skeleton: MovieSearchSkeleton,
  getItemKey: (item) => item.id,
}
