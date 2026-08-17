import { useMutation } from '@tanstack/react-query'

import { postApi } from '../api/post.api'
import { restorePostLikes, snapshotPostLikes } from '../utils/post-like-cache'

export const useUnLikePostMutation = (parentId: string | null) => {
  return useMutation({
    mutationKey: ['unlike-post'],
    mutationFn: postApi.unlikePost,
    onMutate: (postId, context) => {
      return {
        previous: snapshotPostLikes(context.client, postId, -1, parentId),
      }
    },
    onError: (_error, _postId, onMutateResult, context) => {
      restorePostLikes(context.client, onMutateResult?.previous)
    },
  })
}
