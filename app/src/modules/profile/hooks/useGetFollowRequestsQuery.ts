import { useSuspenseInfiniteQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { followApi } from '../api/follow.api'

export const useGetFollowRequestsQuery = () => {
  return useSuspenseInfiniteQuery({
    queryKey: QUERIES_KEYS.followRequests,
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => followApi.getFollowRequests(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
}
