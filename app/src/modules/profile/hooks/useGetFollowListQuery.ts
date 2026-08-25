import { useSuspenseInfiniteQuery } from '@tanstack/react-query'

import { QUERIES_KEYS, type FollowListType } from '~/common/constants/queries-keys'

import { profileApi } from '../api/profile.api'
import type { FollowUserListResponse } from '../types/follow.types'

const fetchers: Record<
  FollowListType,
  (username: string, cursor?: string) => Promise<FollowUserListResponse>
> = {
  followers: profileApi.getFollowers,
  following: profileApi.getFollowing,
}

export const useGetFollowListQuery = (username: string, type: FollowListType) => {
  return useSuspenseInfiniteQuery({
    queryKey: QUERIES_KEYS.userFollows(username, type),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => fetchers[type](username, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
}
