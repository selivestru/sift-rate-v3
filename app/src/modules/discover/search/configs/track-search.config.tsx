import { MEDIA_TYPES } from '~/common/constants/media-type'

import { discoverSearchApi } from '../api/discover-search.api'
import { TrackSearchCard } from '../components/track/TrackSearchCard'
import { TrackSearchSkeleton } from '../components/track/TrackSearchSkeleton'
import type { DiscoverSearchConfig, TrackSearchItem } from '../types/discover-search.types'

export const trackSearchConfig: DiscoverSearchConfig<TrackSearchItem> = {
  mediaType: MEDIA_TYPES.TRACK,
  title: 'Find tracks',
  description: 'Search single moments worth remembering.',
  searchPlaceholder: 'Search tracks…',
  resultsClassName: 'flex flex-col gap-2',
  skeletonCount: 10,
  pageSize: 10,
  queryKey: ['discover', 'search', 'track'],
  queryFn: discoverSearchApi.searchTracks,
  Card: TrackSearchCard,
  Skeleton: TrackSearchSkeleton,
  getItemKey: (item) => item.id,
}
