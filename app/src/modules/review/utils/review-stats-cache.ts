import type { QueryClient } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import type { MediaStateResponse } from '~/modules/discover'

import type { Review, ReviewStats } from '../types/review.types'

const MY_REVIEW_STATS_PREFIX = ['my-review-stats'] as const

const parseMyReviewStatsQueryKey = (queryKey: readonly unknown[]) => {
  const year = typeof queryKey[1] === 'number' ? queryKey[1] : undefined
  const month = typeof queryKey[2] === 'number' ? queryKey[2] : undefined

  return { year, month }
}

const matchesMyReviewStatsFilter = (createdAt: string, queryKey: readonly unknown[]) => {
  const { year, month } = parseMyReviewStatsQueryKey(queryKey)

  if (year == null) return true

  const date = new Date(createdAt)

  if (date.getUTCFullYear() !== year) return false

  if (month != null && date.getUTCMonth() + 1 !== month) return false

  return true
}

export const patchMyReviewStats = (
  client: QueryClient,
  createdAt: string,
  recipe: (prev: ReviewStats) => ReviewStats,
) => {
  const queries = client.getQueryCache().findAll({ queryKey: MY_REVIEW_STATS_PREFIX })

  for (const query of queries) {
    if (!matchesMyReviewStatsFilter(createdAt, query.queryKey)) continue

    client.setQueryData<ReviewStats>(query.queryKey, (prev) => {
      if (!prev) return prev
      return recipe(prev)
    })
  }
}

export const setMediaStateReview = (client: QueryClient, review: Review) => {
  const { media } = review

  client.setQueryData<MediaStateResponse>(
    QUERIES_KEYS.mediaState({ externalId: media.externalId, mediaType: media.mediaType }),
    (prev) => {
      if (!prev) return prev

      return {
        review,
        plannedItem: null,
      }
    },
  )
}

export const clearMediaStateReview = (
  client: QueryClient,
  media: Pick<Review['media'], 'externalId' | 'mediaType'>,
) => {
  client.setQueryData<MediaStateResponse>(
    QUERIES_KEYS.mediaState({ externalId: media.externalId, mediaType: media.mediaType }),
    (prev) => {
      if (!prev) return prev

      return {
        review: null,
        plannedItem: null,
      }
    },
  )
}
