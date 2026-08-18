import { useMutation } from '@tanstack/react-query'

import { postApi } from '../api/post.api'
import { updatePostInCaches } from '../utils/post-update-cache'

interface UpdatePostVariables {
  postId: string
  content: string
}

export const useUpdatePostMutation = (parentId: string | null) => {
  return useMutation({
    mutationKey: ['update-post'],
    mutationFn: ({ postId, content }: UpdatePostVariables) =>
      postApi.updatePost(postId, { content }),
    onSuccess: (post, _variables, _onMutateResult, context) => {
      updatePostInCaches(context.client, post, parentId)
    },
  })
}
