import { useSuspenseInfiniteQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { profileApi } from '../api/profile.api'

export const useGetFeedQuery = (username: string) => {
  return useSuspenseInfiniteQuery({
    queryKey: QUERIES_KEYS.USER_FEED(username),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => profileApi.getUserFeed(username, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
}
