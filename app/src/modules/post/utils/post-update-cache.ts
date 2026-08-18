import type { InfiniteData, QueryClient } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import type { FeedResponse } from '~/modules/feed'

import type { Post, PostListResponse } from '../types/post.types'
import { getCachedPost, POST_FEED_KEYS } from './post-like-cache'

const updateFeedPost = (
  prev: InfiniteData<FeedResponse> | undefined,
  postId: string,
  updater: (post: Post) => Post,
): InfiniteData<FeedResponse> | undefined => {
  if (!prev) return prev

  return {
    ...prev,
    pages: prev.pages.map((page) => ({
      ...page,
      data: page.data.map((post) => (post.id === postId ? updater(post) : post)),
    })),
  }
}

const updateRepliesPost = (
  prev: InfiniteData<PostListResponse> | undefined,
  postId: string,
  updater: (post: Post) => Post,
): InfiniteData<PostListResponse> | undefined => {
  if (!prev) return prev

  return {
    ...prev,
    pages: prev.pages.map((page) => ({
      ...page,
      data: page.data.map((post) => (post.id === postId ? updater(post) : post)),
    })),
  }
}

const removeFeedPost = (
  prev: InfiniteData<FeedResponse> | undefined,
  postId: string,
): InfiniteData<FeedResponse> | undefined => {
  if (!prev) return prev

  return {
    ...prev,
    pages: prev.pages.map((page) => ({
      ...page,
      data: page.data.filter((post) => post.id !== postId),
    })),
  }
}

const removeRepliesPost = (
  prev: InfiniteData<PostListResponse> | undefined,
  postId: string,
): InfiniteData<PostListResponse> | undefined => {
  if (!prev) return prev

  return {
    ...prev,
    pages: prev.pages.map((page) => ({
      ...page,
      data: page.data.filter((post) => post.id !== postId),
    })),
  }
}

const updatePostInFeedCaches = (
  client: QueryClient,
  postId: string,
  updater: (post: Post) => Post,
) => {
  for (const key of POST_FEED_KEYS) {
    client.setQueryData<InfiniteData<FeedResponse>>(key, (prev) =>
      updateFeedPost(prev, postId, updater),
    )
  }
}

const updatePostInRepliesCaches = (
  client: QueryClient,
  parentId: string,
  postId: string,
  updater: (post: Post) => Post,
) => {
  client.setQueryData<InfiniteData<PostListResponse>>(QUERIES_KEYS.POST_REPLIES(parentId), (prev) =>
    updateRepliesPost(prev, postId, updater),
  )
}

export const updatePostInCaches = (client: QueryClient, post: Post, parentId: string | null) => {
  updatePostInFeedCaches(client, post.id, () => post)

  client.setQueryData<Post>(QUERIES_KEYS.POST(post.id), post)

  if (parentId) {
    updatePostInRepliesCaches(client, parentId, post.id, () => post)
  }
}

export const removePostFromCaches = (
  client: QueryClient,
  postId: string,
  parentId: string | null,
) => {
  for (const key of POST_FEED_KEYS) {
    client.setQueryData<InfiniteData<FeedResponse>>(key, (prev) => removeFeedPost(prev, postId))
  }

  if (parentId) {
    client.setQueryData<InfiniteData<PostListResponse>>(
      QUERIES_KEYS.POST_REPLIES(parentId),
      (prev) => removeRepliesPost(prev, postId),
    )
  }
}

export const decrementPostRepliesCount = (client: QueryClient, parentId: string) => {
  const updater = (post: Post): Post => ({
    ...post,
    repliesCount: Math.max(0, post.repliesCount - 1),
  })

  updatePostInFeedCaches(client, parentId, updater)

  client.setQueryData<Post>(QUERIES_KEYS.POST(parentId), (prev) =>
    prev ? updater(prev) : undefined,
  )

  const parent = getCachedPost(client, parentId)

  if (parent?.parentId) {
    updatePostInRepliesCaches(client, parent.parentId, parentId, updater)
  }
}
