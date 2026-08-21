import { useInfiniteQuery } from '@tanstack/react-query'

import type { MediaType } from '~/common/constants/media-type'
import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { reviewApi } from '../api/review.api'
import { DEFAULT_REVIEW_SORT, type ReviewSort } from '../constants/sort'

interface UseMyReviewsQueryOptions {
  q?: string
  mediaType?: MediaType
  rating?: number
  sort?: ReviewSort
  enabled?: boolean
}

export const useMyReviewsQuery = (options?: UseMyReviewsQueryOptions) => {
  const normalizedQ = options?.q?.trim() || undefined
  const mediaType = options?.mediaType
  const rating = options?.rating
  const sort = options?.sort ?? DEFAULT_REVIEW_SORT

  return useInfiniteQuery({
    queryKey: [...QUERIES_KEYS.myReviews, normalizedQ ?? '', mediaType ?? '', rating ?? '', sort],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      reviewApi.getMyReviews({
        cursor: pageParam,
        q: normalizedQ,
        mediaType: mediaType?.toLowerCase(),
        rating,
        sort,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: options?.enabled ?? true,
  })
}
