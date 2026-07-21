import { useInfiniteQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { reviewApi } from '../api/review.api'

export const useMyReviewsQuery = () => {
  return useInfiniteQuery({
    queryKey: QUERIES_KEYS.MY_REVIEWS,
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => reviewApi.getMyReviews(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
}
