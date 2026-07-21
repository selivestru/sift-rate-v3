import type { PlannedListItem } from '~/modules/planned'
import type { Review } from '~/modules/review'

export interface MediaStateResponse {
  review: Review | null
  plannedItem: PlannedListItem | null
}

export type MediaReviewItem = Review & {
  user: {
    id: string
    username: string | null
    avatarUrl: string | null
  }
}

export interface MediaReviewResponse {
  data: MediaReviewItem[]
  nextCursor: string | null
}
