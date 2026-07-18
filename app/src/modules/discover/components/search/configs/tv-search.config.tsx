import { MEDIA_TYPES } from '~/common/constants/media-type'

import { discoverApi } from '../../../api/discover.api'
import { TvSearchCard } from '../components/media/tv-show/TvSearchCard'
import { TvSearchSkeleton } from '../components/media/tv-show/TvSearchSkeleton'
import type { DiscoverSearchConfig, TvSearchItem } from '../types/discover-search.types'

export const tvSearchConfig: DiscoverSearchConfig<TvSearchItem> = {
  mediaType: MEDIA_TYPES.TV_SHOW,
  title: 'Find TV shows',
  description: 'Search series and seasons worth following.',
  searchPlaceholder: 'Search TV shows…',
  skeletonCount: 6,
  pageSize: 10,
  resultsClassName: 'flex flex-col gap-3',
  queryKey: ['discover', 'search', 'tv_show'],
  queryFn: discoverApi.searchTvShows,
  Card: TvSearchCard,
  Skeleton: TvSearchSkeleton,
  getItemKey: (item) => item.externalId,
}
