import type { InfiniteData, QueryClient } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import type { FeedResponse } from '~/modules/feed/types/feed.types'

export const POST_FEED_KEYS: string[][] = [QUERIES_KEYS.FEED('ALL'), QUERIES_KEYS.FEED('FOLLOWING')]

export interface PostFeedSnapshot {
  key: string[]
  data: InfiniteData<FeedResponse> | undefined
}

export const updateFeedPostLike = (
  prev: InfiniteData<FeedResponse> | undefined,
  postId: string,
  delta: 1 | -1,
  isLiked: boolean,
): InfiniteData<FeedResponse> | undefined => {
  if (!prev) return prev

  return {
    ...prev,
    pages: prev.pages.map((page) => ({
      ...page,
      data: page.data.map((post) =>
        post.id === postId
          ? { ...post, likesCount: Math.max(0, post.likesCount + delta), isLiked }
          : post,
      ),
    })),
  }
}

export const snapshotFeedPostLikes = (
  client: QueryClient,
  postId: string,
  delta: 1 | -1,
  isLiked: boolean,
): PostFeedSnapshot[] => {
  const snapshots: PostFeedSnapshot[] = []

  for (const key of POST_FEED_KEYS) {
    const data = client.getQueryData<InfiniteData<FeedResponse>>(key)
    if (!data) continue

    snapshots.push({ key, data })
    client.setQueryData<InfiniteData<FeedResponse>>(
      key,
      updateFeedPostLike(data, postId, delta, isLiked),
    )
  }

  return snapshots
}

export const restoreFeedPostLikes = (
  client: QueryClient,
  snapshots: PostFeedSnapshot[] | undefined,
) => {
  if (!snapshots) return

  for (const { key, data } of snapshots) {
    client.setQueryData<InfiniteData<FeedResponse>>(key, data)
  }
}
