import { useQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { reviewApi } from '../api/review.api'

export const useMyReviewStatsQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: QUERIES_KEYS.MY_REVIEW_STATS,
    queryFn: reviewApi.getMyReviewStats,
    enabled: options?.enabled ?? true,
  })
}
