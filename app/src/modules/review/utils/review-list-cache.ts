import type { InfiniteData, QueryClient } from '@tanstack/react-query'

import type { MediaType } from '~/common/constants/media-type'
import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import type { MediaReviewItem, MediaReviewResponse } from '~/modules/discover'
import type { FeedAuthor, FeedResponse } from '~/modules/feed'

import { REVIEW_SORT, type ReviewSort } from '../constants/sort'
import type { MyReviewsResponse, Review } from '../types/review.types'

export type MyReviewsFilter = {
  q: string
  mediaType?: MediaType
  rating?: number
  sort: ReviewSort
}

export type MediaReviewAuthor = MediaReviewItem['user']

export const matchesMyReviewsFilter = (
  review: Review,
  filters: Pick<MyReviewsFilter, 'q' | 'mediaType' | 'rating'>,
) => {
  if (filters.mediaType && review.media.mediaType !== filters.mediaType) {
    return false
  }

  if (filters.rating != null && review.rating !== filters.rating) {
    return false
  }

  if (filters.q) {
    return review.media.title.toLowerCase().includes(filters.q.toLowerCase())
  }

  return true
}

export const parseMyReviewsQueryKey = (queryKey: readonly unknown[]): MyReviewsFilter => {
  const q = typeof queryKey[1] === 'string' ? queryKey[1] : ''
  const mediaType =
    typeof queryKey[2] === 'string' && queryKey[2] !== '' ? (queryKey[2] as MediaType) : undefined
  const rating = typeof queryKey[3] === 'number' ? queryKey[3] : undefined
  const sort = queryKey[4] === REVIEW_SORT.OLDEST ? REVIEW_SORT.OLDEST : REVIEW_SORT.NEWEST

  return { q, mediaType, rating, sort }
}

const removeReviewFromPages = <T extends { id: string }>(
  prev: InfiniteData<{ data: T[]; nextCursor: string | null }>,
  reviewId: string,
): InfiniteData<{ data: T[]; nextCursor: string | null }> => {
  return {
    ...prev,
    pages: prev.pages.map((page) => ({
      ...page,
      data: page.data.filter((item) => item.id !== reviewId),
    })),
  }
}

export const upsertReviewInMyReviewsData = (
  prev: InfiniteData<MyReviewsResponse> | undefined,
  review: Review,
  filters: MyReviewsFilter,
): InfiniteData<MyReviewsResponse> | undefined => {
  if (!prev) return prev

  const matches = matchesMyReviewsFilter(review, filters)
  const exists = prev.pages.some((page) => page.data.some((item) => item.id === review.id))

  if (exists) {
    if (!matches) {
      return removeReviewFromPages(prev, review.id)
    }

    return {
      ...prev,
      pages: prev.pages.map((page) => ({
        ...page,
        data: page.data.map((item) => (item.id === review.id ? review : item)),
      })),
    }
  }

  if (!matches) return prev

  if (filters.sort === REVIEW_SORT.OLDEST) {
    const lastPage = prev.pages[prev.pages.length - 1]

    if (!lastPage || lastPage.nextCursor !== null) return prev

    return {
      ...prev,
      pages: prev.pages.map((page, index) =>
        index === prev.pages.length - 1 ? { ...page, data: [...page.data, review] } : page,
      ),
    }
  }

  return {
    ...prev,
    pages: prev.pages.map((page, index) =>
      index === 0 ? { ...page, data: [review, ...page.data] } : page,
    ),
  }
}

export const removeReviewFromMyReviewsData = (
  prev: InfiniteData<MyReviewsResponse> | undefined,
  reviewId: string,
): InfiniteData<MyReviewsResponse> | undefined => {
  if (!prev) return prev

  return removeReviewFromPages(prev, reviewId)
}

type ReviewListItem = Review & { user: MediaReviewAuthor }
type ReviewListResponse = { data: ReviewListItem[]; nextCursor: string | null }

const upsertReviewInReviewListData = (
  prev: InfiniteData<ReviewListResponse> | undefined,
  review: Review,
  user: MediaReviewAuthor | null,
  insertIfMissing = true,
): InfiniteData<ReviewListResponse> | undefined => {
  if (!prev) return prev

  const exists = prev.pages.some((page) => page.data.some((item) => item.id === review.id))

  if (exists) {
    return {
      ...prev,
      pages: prev.pages.map((page) => ({
        ...page,
        data: page.data.map((item) =>
          item.id === review.id ? { ...item, ...review, user: item.user } : item,
        ),
      })),
    }
  }

  if (!insertIfMissing || !user) return prev

  const item: ReviewListItem = { ...review, user }

  return {
    ...prev,
    pages: prev.pages.map((page, index) =>
      index === 0 ? { ...page, data: [item, ...page.data] } : page,
    ),
  }
}

export const upsertReviewInMediaReviewsData = (
  prev: InfiniteData<MediaReviewResponse> | undefined,
  review: Review,
  user: MediaReviewAuthor | null,
): InfiniteData<MediaReviewResponse> | undefined => upsertReviewInReviewListData(prev, review, user)

export const removeReviewFromMediaReviewsData = (
  prev: InfiniteData<MediaReviewResponse> | undefined,
  reviewId: string,
): InfiniteData<MediaReviewResponse> | undefined => {
  if (!prev) return prev

  return removeReviewFromPages(prev, reviewId)
}

export const upsertReviewInFeedData = (
  prev: InfiniteData<FeedResponse> | undefined,
  review: Review,
  user: FeedAuthor | null,
  insertIfMissing = true,
): InfiniteData<FeedResponse> | undefined =>
  upsertReviewInReviewListData(prev, review, user, insertIfMissing)

export const removeReviewFromFeedData = (
  prev: InfiniteData<FeedResponse> | undefined,
  reviewId: string,
): InfiniteData<FeedResponse> | undefined => {
  if (!prev) return prev

  return removeReviewFromPages(prev, reviewId)
}

const upsertReviewInMyReviewsCache = (client: QueryClient, review: Review) => {
  const queries = client.getQueryCache().findAll({ queryKey: QUERIES_KEYS.myReviews })

  for (const query of queries) {
    client.setQueryData<InfiniteData<MyReviewsResponse>>(query.queryKey, (prev) =>
      upsertReviewInMyReviewsData(prev, review, parseMyReviewsQueryKey(query.queryKey)),
    )
  }
}

const removeReviewFromMyReviewsCache = (client: QueryClient, reviewId: string) => {
  const queries = client.getQueryCache().findAll({ queryKey: QUERIES_KEYS.myReviews })

  for (const query of queries) {
    client.setQueryData<InfiniteData<MyReviewsResponse>>(query.queryKey, (prev) =>
      removeReviewFromMyReviewsData(prev, reviewId),
    )
  }
}

const upsertReviewInMediaReviewsCache = (
  client: QueryClient,
  review: Review,
  user: MediaReviewAuthor | null,
) => {
  client.setQueryData<InfiniteData<MediaReviewResponse>>(
    QUERIES_KEYS.mediaReviews({
      mediaType: review.media.mediaType,
      externalId: review.media.externalId,
    }),
    (prev) => upsertReviewInMediaReviewsData(prev, review, user),
  )
}

const removeReviewFromMediaReviewsCache = (client: QueryClient, review: Review) => {
  client.setQueryData<InfiniteData<MediaReviewResponse>>(
    QUERIES_KEYS.mediaReviews({
      mediaType: review.media.mediaType,
      externalId: review.media.externalId,
    }),
    (prev) => removeReviewFromMediaReviewsData(prev, review.id),
  )
}

export const upsertReviewInListCaches = (
  client: QueryClient,
  review: Review,
  user: MediaReviewAuthor | null,
) => {
  upsertReviewInMyReviewsCache(client, review)
  upsertReviewInMediaReviewsCache(client, review, user)
}

export const removeReviewFromListCaches = (client: QueryClient, review: Review) => {
  removeReviewFromMyReviewsCache(client, review.id)
  removeReviewFromMediaReviewsCache(client, review)
}

export const upsertReviewInFeedCaches = (
  client: QueryClient,
  review: Review,
  user: FeedAuthor | null,
  username?: string | null,
  insertIfMissing = true,
) => {
  client.setQueryData<InfiniteData<FeedResponse>>(QUERIES_KEYS.feed, (prev) =>
    upsertReviewInFeedData(prev, review, user, insertIfMissing),
  )

  if (!username) return

  client.setQueryData<InfiniteData<FeedResponse>>(QUERIES_KEYS.userFeed(username), (prev) =>
    upsertReviewInFeedData(prev, review, user, insertIfMissing),
  )
}

export const removeReviewFromFeedCaches = (
  client: QueryClient,
  review: Review,
  username?: string | null,
) => {
  client.setQueryData<InfiniteData<FeedResponse>>(QUERIES_KEYS.feed, (prev) =>
    removeReviewFromFeedData(prev, review.id),
  )

  if (!username) return

  client.setQueryData<InfiniteData<FeedResponse>>(QUERIES_KEYS.userFeed(username), (prev) =>
    removeReviewFromFeedData(prev, review.id),
  )
}
