import type { MediaType } from './media-type'

export const QUERIES_KEYS = {
  PLANNED_LIST: ['planned-list'],
  MEDIA_STATE: (data: { mediaType: MediaType; externalId: string }) => [
    'media-state',
    data.mediaType,
    data.externalId,
  ],
  MY_REVIEWS: ['my-reviews'],
  MY_REVIEW_STATS: ['my-review-stats'],
  MEDIA_REVIEWS: (data: { mediaType: MediaType; externalId: string }) => [
    'media-reviews',
    data.mediaType,
    data.externalId,
  ],
  RANKED_LISTS: ['ranked-lists'],
  PROFILE: (username: string) => ['profile', username],
}
