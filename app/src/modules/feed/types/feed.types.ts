import type { ResponseWithCursor } from '~/common/types/response-with-cursor.types'
import type { Review } from '~/modules/review'

export type FeedAuthor = {
  id: string
  username: string | null
  displayName: string | null
  avatarUrl: string | null
}

export type FeedItem = Review & { user: FeedAuthor }

export type FeedResponse = ResponseWithCursor<FeedItem>
