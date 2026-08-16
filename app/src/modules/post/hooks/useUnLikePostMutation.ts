import { useMutation } from '@tanstack/react-query'

import { postApi } from '../api/post.api'
import { restoreFeedPostLikes, snapshotFeedPostLikes } from '../utils/post-like-cache'

export const useUnLikePostMutation = () => {
  return useMutation({
    mutationKey: ['unlike-post'],
    mutationFn: postApi.unlikePost,
    onMutate: (postId, context) => {
      return {
        previous: snapshotFeedPostLikes(context.client, postId, -1, false),
      }
    },
    onError: (_error, _postId, onMutateResult, context) => {
      restoreFeedPostLikes(context.client, onMutateResult?.previous)
    },
  })
}
