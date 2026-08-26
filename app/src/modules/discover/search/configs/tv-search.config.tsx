import { MEDIA_TYPES } from '~/common/constants/media-type'

import { discoverSearchApi } from '../api/discover-search.api'
import { TvSearchCard } from '../components/tv-show/TvSearchCard'
import { TvSearchSkeleton } from '../components/tv-show/TvSearchSkeleton'
import type { DiscoverSearchConfig, TvSearchItem } from '../types/discover-search.types'

export const tvSearchConfig: DiscoverSearchConfig<TvSearchItem> = {
  mediaType: MEDIA_TYPES.TV_SHOW,
  skeletonCount: 6,
  pageSize: 10,
  resultsClassName: 'flex flex-col gap-3',
  queryKey: ['discover', 'search', 'tv_show'],
  queryFn: discoverSearchApi.searchTvShows,
  Card: TvSearchCard,
  Skeleton: TvSearchSkeleton,
  getItemKey: (item) => item.id,
}
