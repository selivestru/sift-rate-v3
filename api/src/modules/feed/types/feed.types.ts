import { Author } from '~/common/types/user.types'
import { ReviewItem } from '~/modules/review/types/review.types'

export type FeedItemKind = 'REVIEW' | 'POST'

export interface FeedItem {
  id: string
  content: string | null
  userId: string
  reviewId: string | null
  createdAt: Date
  user: Author
  review: ReviewItem | null
}

export interface FeedResponse {
  data: FeedItem[]
  nextCursor: string | null
}
