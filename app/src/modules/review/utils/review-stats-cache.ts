import type { QueryClient } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import type { ReviewStats } from '../types/review.types'

export const patchMyReviewStats = (
  client: QueryClient,
  recipe: (prev: ReviewStats) => ReviewStats,
) => {
  client.setQueryData<ReviewStats>(QUERIES_KEYS.MY_REVIEW_STATS, (prev) => {
    if (!prev) return prev
    return recipe(prev)
  })
}
