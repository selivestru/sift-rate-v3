import type { MediaType } from '~/common/constants/media-type'

import type { ReviewStats } from '../types/review.types'

const clampCount = (value: number) => Math.max(0, value)

const bumpMediaType = (
  byMediaType: ReviewStats['byMediaType'],
  mediaType: MediaType,
  delta: number,
): ReviewStats['byMediaType'] => ({
  ...byMediaType,
  [mediaType]: clampCount((byMediaType[mediaType] ?? 0) + delta),
})

const bumpRating = (
  byRating: ReviewStats['byRating'],
  rating: number,
  delta: number,
): ReviewStats['byRating'] => ({
  ...byRating,
  [rating]: clampCount((byRating[rating] ?? 0) + delta),
})

export const getMediaTypeCount = (stats: ReviewStats | undefined, mediaType: MediaType) => {
  return stats?.byMediaType[mediaType] ?? 0
}

export const getRatingCount = (stats: ReviewStats | undefined, rating: number) => {
  return stats?.byRating[rating] ?? 0
}

export const applyReviewCreated = (
  stats: ReviewStats,
  input: { mediaType: MediaType; rating: number },
): ReviewStats => ({
  total: clampCount(stats.total + 1),
  byMediaType: bumpMediaType(stats.byMediaType, input.mediaType, 1),
  byRating: bumpRating(stats.byRating, input.rating, 1),
})

export const applyReviewDeleted = (
  stats: ReviewStats,
  input: { mediaType: MediaType; rating: number },
): ReviewStats => ({
  total: clampCount(stats.total - 1),
  byMediaType: bumpMediaType(stats.byMediaType, input.mediaType, -1),
  byRating: bumpRating(stats.byRating, input.rating, -1),
})

export const applyReviewRatingChanged = (
  stats: ReviewStats,
  input: { fromRating: number; toRating: number },
): ReviewStats => {
  if (input.fromRating === input.toRating) {
    return stats
  }

  return {
    total: stats.total,
    byMediaType: stats.byMediaType,
    byRating: bumpRating(bumpRating(stats.byRating, input.fromRating, -1), input.toRating, 1),
  }
}
