import { MEDIA_TYPES } from '~/common/constants/media-type'

import { discoverApi } from '../../../api/discover.api'
import { AlbumSearchCard } from '../components/media/album/AlbumSearchCard'
import { AlbumSearchSkeleton } from '../components/media/album/AlbumSearchSkeleton'
import type { AlbumSearchItem, DiscoverSearchConfig } from '../types/discover-search.types'

export const albumSearchConfig: DiscoverSearchConfig<AlbumSearchItem> = {
  mediaType: MEDIA_TYPES.ALBUM,
  title: 'Find albums',
  description: 'Search full listens to keep in your life.',
  searchPlaceholder: 'Search albums…',
  skeletonCount: 9,
  pageSize: 9,
  resultsClassName: 'grid grid-cols-2 gap-3 sm:grid-cols-3',
  queryKey: ['discover', 'search', 'album'],
  queryFn: discoverApi.searchAlbums,
  Card: AlbumSearchCard,
  Skeleton: AlbumSearchSkeleton,
  getItemKey: (item) => item.id,
}
