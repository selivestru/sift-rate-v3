import type { ResponseWithCursor } from '~/common/types/response-with-cursor.types'
import type { Review } from '~/modules/review'

export type FeedTabKey = 'ALL' | 'FOLLOWING'

export interface Author {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
}

export interface FeedItem {
  id: string
  content: string | null
  userId: string
  createdAt: string
  user: Author
  review: Review | null
}

export type FeedResponse = ResponseWithCursor<FeedItem>
