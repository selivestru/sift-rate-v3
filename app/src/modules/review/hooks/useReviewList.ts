import { useState } from 'react'

import type { MediaType } from '~/common/constants/media-type'
import { useDebouncedValue } from '~/common/hooks/useDebouncedValue'
import { useIntersectionObserver } from '~/common/hooks/useIntersectionObserver'

import { DEFAULT_REVIEW_SORT, type ReviewSort } from '../constants/sort'
import { useMyReviewsQuery } from './useMyReviewsQuery'
import { useMyReviewStatsQuery } from './useMyReviewStatsQuery'

export const useReviewList = () => {
  const [query, setQuery] = useState('')
  const [mediaType, setMediaType] = useState<MediaType | undefined>()
  const [rating, setRating] = useState<number | undefined>()
  const [sort, setSort] = useState<ReviewSort>(DEFAULT_REVIEW_SORT)
  const debouncedQ = useDebouncedValue(query, 300)

  const { data, fetchNextPage, hasNextPage, isPending, isFetching, isFetchingNextPage, isError } =
    useMyReviewsQuery({ q: debouncedQ, mediaType, rating, sort })

  const {
    data: stats,
    isPending: isStatsPending,
    isFetching: isStatsFetching,
  } = useMyReviewStatsQuery()

  const reviews = data?.pages.flatMap((page) => page.data) ?? []
  const hasActiveFilters = Boolean(debouncedQ.trim()) || Boolean(mediaType) || rating != null
  const isInitialLoading = isPending || (isFetching && !isFetchingNextPage && !data)
  const isListFetching = isFetching && !isFetchingNextPage
  const isStatsLoading = isStatsPending || (isStatsFetching && !stats)

  const loadMoreRef = useIntersectionObserver(
    () => fetchNextPage(),
    hasNextPage && !isFetchingNextPage,
  )

  return {
    query,
    setQuery,
    mediaType,
    setMediaType,
    rating,
    setRating,
    sort,
    setSort,
    reviews,
    stats,
    isStatsLoading,
    hasActiveFilters,
    isInitialLoading,
    isError,
    isListFetching,
    isFetchingNextPage,
    loadMoreRef,
  }
}
