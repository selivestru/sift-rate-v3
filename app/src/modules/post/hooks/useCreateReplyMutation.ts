import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { postApi } from '../api/post.api'
import type { CreatePostInput } from '../schema/create-post.schema'
import type { PostListResponse } from '../types/post.types'
import { bumpPostRepliesCount } from '../utils/post-replies-cache'

export const useCreateReplyMutation = (postId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['create-reply', postId],
    mutationFn: (body: CreatePostInput) => postApi.createReply(postId, body),
    onSuccess: (reply) => {
      bumpPostRepliesCount(queryClient, postId)

      queryClient.setQueryData<InfiniteData<PostListResponse>>(
        QUERIES_KEYS.POST_REPLIES(postId),
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
    },
  })
}
