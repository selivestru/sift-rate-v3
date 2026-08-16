import { useInfiniteQuery } from '@tanstack/react-query'

import { QUERIES_KEYS, type FeedTabKey } from '~/common/constants/queries-keys'

import { feedApi } from '../api/feed.api'
import type { FeedResponse } from '../types/feed.types'

const fetchers: Record<FeedTabKey, (cursor?: string) => Promise<FeedResponse>> = {
  ALL: feedApi.getFeed,
  FOLLOWING: feedApi.getFollowingFeed,
}

export const useGetFeedQuery = (tab: FeedTabKey) => {
  return useInfiniteQuery({
    queryKey: QUERIES_KEYS.FEED(tab),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => fetchers[tab](pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 0,
  })
}
