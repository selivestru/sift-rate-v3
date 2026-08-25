import { useQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { reviewApi } from '../api/review.api'

export const useMyReviewStatsQuery = (year?: number, month?: number) => {
  return useQuery({
    queryKey: QUERIES_KEYS.myReviewStats(year, month),
    queryFn: () => reviewApi.getMyReviewStats(year, month),
  })
}
