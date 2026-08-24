import type { InfiniteData, QueryClient } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import type { FeedResponse } from '~/modules/feed'

import type { Post, PostListResponse } from '../types/post.types'
import { getCachedPost, POST_FEED_KEYS } from './post-like-cache'

export const prependReplyToRepliesCache = (client: QueryClient, parentId: string, reply: Post) => {
  client.setQueryData<InfiniteData<PostListResponse>>(
    QUERIES_KEYS.postReplies(parentId),
    (prev) => {
      if (!prev) return prev

      return {
        ...prev,
        pages: prev.pages.map((page, index) =>
          index === 0 ? { ...page, data: [reply, ...page.data] } : page,
        ),
      }
    },
  )
}

export const bumpPostRepliesCount = (client: QueryClient, postId: string) => {
  const post = getCachedPost(client, postId)

  if (!post) return

  const updated = { ...post, repliesCount: post.repliesCount + 1 }

  updatePostInFeedCaches(client, updated)

  client.setQueryData<Post>(QUERIES_KEYS.post(post.id), (prev) =>
    prev ? { ...prev, repliesCount: prev.repliesCount + 1 } : undefined,
  )

  if (post.parentId) {
    bumpPostInRepliesCache(client, post.parentId, post.id)
  }
}

const updatePostInFeedCaches = (client: QueryClient, updated: Post) => {
  for (const key of POST_FEED_KEYS) {
    client.setQueryData<InfiniteData<FeedResponse>>(key, (prev) => {
      if (!prev) return prev

      return {
        ...prev,
        pages: prev.pages.map((page) => ({
          ...page,
          data: page.data.map((post) => (post.id === updated.id ? updated : post)),
        })),
      }
    })
  }
}

const bumpPostInRepliesCache = (client: QueryClient, parentId: string, postId: string) => {
  client.setQueryData<InfiniteData<PostListResponse>>(
    QUERIES_KEYS.postReplies(parentId),
    (prev) => {
      if (!prev) return prev

      return {
        ...prev,
        pages: prev.pages.map((page) => ({
          ...page,
          data: page.data.map((post) =>
            post.id === postId ? { ...post, repliesCount: post.repliesCount + 1 } : post,
          ),
        })),
      }
    },
  )
}
