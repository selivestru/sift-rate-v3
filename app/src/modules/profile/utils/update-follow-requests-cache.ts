import type { QueryClient, InfiniteData } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import type { FollowRequestsCount, FollowRequestsResponse } from '../types/follow.types'

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
