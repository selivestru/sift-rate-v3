import type { MediaRef } from '../types/media-ref.types'

export const QUERIES_KEYS = {
  plannedList: ['planned-list'],
  mediaState: (data: MediaRef) => ['media-state', data.mediaType, data.externalId],
  myReviews: ['my-reviews'],
  myReviewStats: ['my-review-stats'],
  mediaReviews: (data: MediaRef) => ['media-reviews', data.mediaType, data.externalId],
  rankedLists: ['ranked-lists'],
  profile: (username: string) => ['profile', username],
  userActivity: (username: string) => ['user-activity', username],
  userFeed: (username: string) => ['user-feed', username],
  feed: ['feed'],
} as const
