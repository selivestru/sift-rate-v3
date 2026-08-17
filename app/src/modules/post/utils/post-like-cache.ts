import type { InfiniteData, QueryClient } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import type { FeedResponse } from '~/modules/feed'

import type { Post, PostListResponse } from '../types/post.types'

export const POST_FEED_KEYS: string[][] = [QUERIES_KEYS.FEED('ALL'), QUERIES_KEYS.FEED('FOLLOWING')]

export interface PostLikeSnapshot {
  key: string[]
  data: unknown
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

export const updateSinglePostLike = (
  prev: Post | undefined,
  delta: 1 | -1,
  isLiked: boolean,
): Post | undefined => {
  if (!prev) return prev

  return { ...prev, likesCount: Math.max(0, prev.likesCount + delta), isLiked }
}

export const updateRepliesPostLike = (
  prev: InfiniteData<PostListResponse> | undefined,
  postId: string,
  delta: 1 | -1,
  isLiked: boolean,
): InfiniteData<PostListResponse> | undefined => {
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

export const getCachedPost = (client: QueryClient, postId: string): Post | undefined => {
  return (
    client.getQueryData<Post>(QUERIES_KEYS.POST(postId)) ?? findPostInFeedCaches(client, postId)
  )
}

const findPostInFeedCaches = (client: QueryClient, postId: string): Post | undefined => {
  for (const key of POST_FEED_KEYS) {
    const data = client.getQueryData<InfiniteData<FeedResponse>>(key)
    const post = data?.pages.flatMap((page) => page.data).find((item) => item.id === postId)

    if (post) return post
  }

  return undefined
}

const snapshotPostLikeCache = <T>(
  client: QueryClient,
  key: string[],
  snapshots: PostLikeSnapshot[],
  update: (prev: T | undefined) => T | undefined,
) => {
  const data = client.getQueryData<T>(key)

  if (!data) return

  snapshots.push({ key, data })

  client.setQueryData<T>(key, update(data))
}

export const snapshotPostLikes = (
  client: QueryClient,
  postId: string,
  delta: 1 | -1,
  parentId: string | null,
): PostLikeSnapshot[] => {
  const isLiked = delta === 1
  const snapshots: PostLikeSnapshot[] = []

  const post = getCachedPost(client, postId)

  for (const key of POST_FEED_KEYS) {
    snapshotPostLikeCache<InfiniteData<FeedResponse>>(client, key, snapshots, (prev) =>
      updateFeedPostLike(prev, postId, delta, isLiked),
    )
  }

  snapshotPostLikeCache<Post>(client, QUERIES_KEYS.POST(postId), snapshots, (prev) =>
    updateSinglePostLike(prev, delta, isLiked),
  )

  const repliesParentId = parentId ?? post?.parentId

  if (repliesParentId) {
    snapshotPostLikeCache<InfiniteData<PostListResponse>>(
      client,
      QUERIES_KEYS.POST_REPLIES(repliesParentId),
      snapshots,
      (prev) => updateRepliesPostLike(prev, postId, delta, isLiked),
    )
  }

  return snapshots
}

export const restorePostLikes = (
  client: QueryClient,
  snapshots: PostLikeSnapshot[] | undefined,
) => {
  if (!snapshots) return

  for (const { key, data } of snapshots) {
    client.setQueryData(key, data)
  }
}
