import { useInfiniteQuery } from '@tanstack/react-query'

import type { MediaType } from '~/common/constants/media-type'
import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import { useAppLocale } from '~/common/i18n'

import { reviewApi } from '../api/review.api'
import { DEFAULT_REVIEW_SORT, type ReviewSort } from '../constants/sort'

interface UseMyReviewsQueryOptions {
  q?: string
  mediaType?: MediaType
  rating?: number
  sort?: ReviewSort
  year?: number
  month?: number
  enabled?: boolean
}

export const useMyReviewsQuery = (options?: UseMyReviewsQueryOptions) => {
  const { locale } = useAppLocale()
  const normalizedQ = options?.q?.trim() || undefined
  const mediaType = options?.mediaType
  const rating = options?.rating
  const sort = options?.sort ?? DEFAULT_REVIEW_SORT
  const year = options?.year
  const month = options?.month

  return useInfiniteQuery({
    queryKey: [
      ...QUERIES_KEYS.myReviews,
      normalizedQ ?? '',
      mediaType ?? '',
      rating ?? '',
      sort,
      year ?? '',
      month ?? '',
      locale,
    ],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      reviewApi.getMyReviews({
        cursor: pageParam,
        q: normalizedQ,
        mediaType: mediaType?.toLowerCase(),
        rating,
        sort,
        year,
        month: year != null ? month : undefined,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: options?.enabled ?? true,
  })
}
