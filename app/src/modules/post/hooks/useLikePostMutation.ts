import { useMutation } from '@tanstack/react-query'

import { postApi } from '../api/post.api'
import { restoreFeedPostLikes, snapshotFeedPostLikes } from '../utils/post-like-cache'

export const useLikePostMutation = () => {
  return useMutation({
    mutationKey: ['like-post'],
    mutationFn: postApi.likePost,
    onMutate: (postId, context) => {
      return {
        previous: snapshotFeedPostLikes(context.client, postId, 1, true),
      }
    },
    onError: (_error, _postId, onMutateResult, context) => {
      restoreFeedPostLikes(context.client, onMutateResult?.previous)
    },
  })
}
