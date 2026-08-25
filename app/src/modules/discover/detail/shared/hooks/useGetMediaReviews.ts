import { useSuspenseInfiniteQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import type { MediaRef } from '~/common/types/media-ref.types'

import { discoverDetailApi } from '../api/discover-detail.api'

export const useGetMediaReviews = (params: MediaRef) => {
  return useSuspenseInfiniteQuery({
    queryKey: QUERIES_KEYS.mediaReviews(params),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => discoverDetailApi.getMediaReviews(params, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
}
