import { MEDIA_TYPES } from '~/common/constants/media-type'

import { discoverSearchApi } from '../api/discover-search.api'
import { GameSearchCard } from '../components/game/GameSearchCard'
import { GameSearchSkeleton } from '../components/game/GameSearchSkeleton'
import type { DiscoverSearchConfig, GameSearchItem } from '../types/discover-search.types'

export const gameSearchConfig: DiscoverSearchConfig<GameSearchItem> = {
  mediaType: MEDIA_TYPES.GAME,
  title: 'Find games',
  description: 'Search playthroughs ahead of your next session.',
  searchPlaceholder: 'Search games…',
  skeletonCount: 9,
  pageSize: 9,
  resultsClassName: 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3',
  queryKey: ['discover', 'search', 'game'],
  queryFn: discoverSearchApi.searchGames,
  Card: GameSearchCard,
  Skeleton: GameSearchSkeleton,
  getItemKey: (item) => item.id,
}
