import type { MediaRef } from '../types/media-ref.types'

export type FeedTabKey = 'ALL' | 'FOLLOWING'

export const QUERIES_KEYS = {
  plannedList: ['planned-list'],
  mediaState: (data: MediaRef) => ['media-state', data.mediaType, data.externalId],
  myReviews: ['my-reviews'],
  myReviewStats: ['my-review-stats'],
  mediaReviews: (data: MediaRef) => ['media-reviews', data.mediaType, data.externalId],
  rankedLists: ['ranked-lists'],
  notifications: ['notifications'],
  notificationsUnreadCount: ['notifications-unread-count'],
  followRequests: ['follow-requests'],
  followRequestsCount: ['follow-requests-count'],
  profile: (username: string) => ['profile', username],
  userActivity: (username: string) => ['user-activity', username],
  userFeed: (username: string) => ['user-feed', username],
  feed: (tab: FeedTabKey) => ['feed', tab],
  post: (postId: string) => ['post', postId],
  postReplies: (postId: string) => ['post', postId, 'replies'],
} as const
