import type { QueryClient, InfiniteData } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import type {
  FollowRequest,
  FollowRequestsCount,
  FollowRequestsResponse,
  FollowViewerStatus,
} from '../types/follow.types'
import type { Profile } from '../types/profile.types'

export const updateProfileFollowInCache = (
  queryClient: QueryClient,
  username: string,
  followStatus: FollowViewerStatus,
  followersDelta: 1 | -1,
) => {
  queryClient.setQueryData<Profile>(QUERIES_KEYS.profile(username), (prev) => {
    if (!prev) return prev

    return {
      ...prev,
      followStatus,
      followersCount:
        followersDelta === 1 ? prev.followersCount + 1 : Math.max(0, prev.followersCount - 1),
    }
  })
}

export const prependFollowRequestToCache = (queryClient: QueryClient, request: FollowRequest) => {
  queryClient.setQueryData<InfiniteData<FollowRequestsResponse>>(
    QUERIES_KEYS.followRequests,
    (prev) => {
      if (!prev) return prev

      return {
        ...prev,
        pages: prev.pages.map((page, index) =>
          index === 0
            ? {
                ...page,
                data: page.data.some((author) => author.id === request.id)
                  ? page.data
                  : [request, ...page.data],
              }
            : page,
        ),
      }
    },
  )

  queryClient.setQueryData<FollowRequestsCount>(QUERIES_KEYS.followRequestsCount, (prev) => {
    if (!prev) return prev

    return { count: prev.count + 1 }
  })
}

export const removeFollowRequestFromCache = (queryClient: QueryClient, followerId: string) => {
  queryClient.setQueryData<InfiniteData<FollowRequestsResponse>>(
    QUERIES_KEYS.followRequests,
    (prev) => {
      if (!prev) return prev

      return {
        ...prev,
        pages: prev.pages.map((page) => ({
          ...page,
          data: page.data.filter((author) => author.id !== followerId),
        })),
      }
    },
  )

  queryClient.setQueryData<FollowRequestsCount>(QUERIES_KEYS.followRequestsCount, (prev) => {
    if (!prev) return prev

    return { count: Math.max(0, prev.count - 1) }
  })
}
