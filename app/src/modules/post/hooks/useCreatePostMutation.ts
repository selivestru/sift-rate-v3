import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import type { FeedResponse } from '~/modules/feed'

import { postApi } from '../api/post.api'

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['create-post'],
    mutationFn: postApi.createPost,
    onSuccess: (post) => {
      queryClient.setQueryData<InfiniteData<FeedResponse>>(QUERIES_KEYS.feed('ALL'), (prev) => {
        if (!prev) return prev

        return {
          ...prev,
          pages: prev.pages.map((page, index) =>
            index === 0 ? { ...page, data: [post, ...page.data] } : page,
          ),
        }
      })
    },
  })
}
