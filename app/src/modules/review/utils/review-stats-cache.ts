import type { QueryClient } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import type { MediaStateResponse } from '~/modules/discover'

import type { Review, ReviewStats } from '../types/review.types'

export const patchMyReviewStats = (
  client: QueryClient,
  recipe: (prev: ReviewStats) => ReviewStats,
) => {
  client.setQueryData<ReviewStats>(QUERIES_KEYS.myReviewStats, (prev) => {
    if (!prev) return prev
    return recipe(prev)
  })
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
