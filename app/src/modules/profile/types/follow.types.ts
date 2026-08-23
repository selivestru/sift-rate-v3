import type { ResponseWithCursor } from '~/common/types/response-with-cursor.types'
import type { Author } from '~/modules/post'

export type FollowViewerStatus = 'NONE' | 'PENDING' | 'FOLLOWING' | 'FOLLOWED_BY' | 'MUTUAL'

export interface FollowStatusResponse {
  followStatus: FollowViewerStatus
}

export type FollowRequestsResponse = ResponseWithCursor<Author>

export interface FollowRequestsCount {
  count: number
}
