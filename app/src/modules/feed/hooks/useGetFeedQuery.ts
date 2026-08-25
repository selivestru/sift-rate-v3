import { useSuspenseInfiniteQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { feedApi } from '../api/feed.api'

export const useGetFeedQuery = () => {
  return useSuspenseInfiniteQuery({
    queryKey: QUERIES_KEYS.feed,
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => feedApi.getFeed(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
}
