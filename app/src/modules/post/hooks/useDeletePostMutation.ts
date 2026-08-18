import { useMutation } from '@tanstack/react-query'

import { postApi } from '../api/post.api'
import { decrementPostRepliesCount, removePostFromCaches } from '../utils/post-update-cache'

export const useDeletePostMutation = (parentId: string | null) => {
  return useMutation({
    mutationKey: ['delete-post'],
    mutationFn: postApi.deletePost,
    onSuccess: (_post, postId, _onMutateResult, context) => {
      removePostFromCaches(context.client, postId, parentId)

      if (parentId) {
        decrementPostRepliesCount(context.client, parentId)
      }
    },
  })
}
