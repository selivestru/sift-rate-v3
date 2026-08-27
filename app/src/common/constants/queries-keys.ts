import type { MediaRef } from '../types/media-ref.types'

export const QUERIES_KEYS = {
  plannedList: ['planned-list'],
  mediaState: (data: MediaRef) => ['media-state', data.mediaType, data.externalId],
  myReviews: ['my-reviews'],
  myReviewStats: (year?: number, month?: number) => ['my-review-stats', year, month],
  mediaReviews: (data: MediaRef) => ['media-reviews', data.mediaType, data.externalId],
  rankedLists: ['ranked-lists'],
  profile: (username: string) => ['profile', username],
  userActivity: (username: string, selectedYear: number) => [
    'user-activity',
    username,
    selectedYear,
  ],
  userFeed: (username: string) => ['user-feed', username],
  feed: ['feed'],
  imdbImportActive: ['imdb-import', 'active'],
  imdbImport: (id: string) => ['imdb-import', id],
  imdbImportHistory: ['imdb-import', 'history'],
  imdbImportRows: (id: string, status?: string) =>
    status ? ['imdb-import', id, 'rows', status] : ['imdb-import', id, 'rows'],
} as const
