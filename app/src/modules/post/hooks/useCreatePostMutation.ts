import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postApi } from '../api/post.api'
import { prependPostToFeedCache } from '../utils/post-update-cache'

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['create-post'],
    mutationFn: postApi.createPost,
    onSuccess: (post) => {
      prependPostToFeedCache(queryClient, post)
    },
  })
}
