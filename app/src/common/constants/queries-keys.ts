import type { MediaType } from './media-type'

export type FeedTabKey = 'ALL' | 'FOLLOWING'

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
  NOTIFICATIONS: ['notifications'],
  NOTIFICATIONS_UNREAD_COUNT: ['notifications-unread-count'],
  PROFILE: (username: string) => ['profile', username],
  USER_ACTIVITY: (username: string) => ['user-activity', username],
  USER_FEED: (username: string) => ['user-feed', username],
  FEED: (tab: FeedTabKey) => ['feed', tab],
  POST: (postId: string) => ['post', postId],
  POST_REPLIES: (postId: string) => ['post', postId, 'replies'],
}
