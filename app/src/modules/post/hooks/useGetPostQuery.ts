import { useSuspenseQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { postApi } from '../api/post.api'

export const useGetPostQuery = (postId: string) => {
  const { data } = useSuspenseQuery({
    queryKey: QUERIES_KEYS.POST(postId),
    queryFn: () => postApi.getPostById(postId),
  })

  return data
}
