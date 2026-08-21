import { useSuspenseInfiniteQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { postApi } from '../api/post.api'
import type { PostListResponse } from '../types/post.types'

export const useGetPostRepliesQuery = (postId: string) => {
  return useSuspenseInfiniteQuery({
    queryKey: QUERIES_KEYS.postReplies(postId),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => postApi.getPostReplies(postId, pageParam),
    getNextPageParam: (lastPage: PostListResponse) => lastPage.nextCursor,
  })
}
