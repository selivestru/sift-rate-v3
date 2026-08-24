import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postApi } from '../api/post.api'
import type { CreatePostInput } from '../schema/create-post.schema'
import { bumpPostRepliesCount, prependReplyToRepliesCache } from '../utils/post-replies-cache'

export const useCreateReplyMutation = (postId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['create-reply', postId],
    mutationFn: (body: CreatePostInput) => postApi.createReply(postId, body),
    onSuccess: (reply) => {
      bumpPostRepliesCount(queryClient, postId)
      prependReplyToRepliesCache(queryClient, postId, reply)
    },
  })
}
