import { useInfiniteQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { reviewApi } from '../api/review.api'

interface UseMyReviewsQueryOptions {
  q?: string
  enabled?: boolean
}

export const useMyReviewsQuery = (options?: UseMyReviewsQueryOptions) => {
  const normalizedQ = options?.q?.trim() || undefined

  return useInfiniteQuery({
    queryKey: [...QUERIES_KEYS.MY_REVIEWS, normalizedQ ?? ''],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      reviewApi.getMyReviews({
        cursor: pageParam,
        q: normalizedQ,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: options?.enabled ?? true,
  })
}
