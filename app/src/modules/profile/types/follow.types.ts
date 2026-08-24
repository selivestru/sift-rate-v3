import type { ResponseWithCursor } from '~/common/types/response-with-cursor.types'
import type { Author } from '~/modules/post'

export type FollowViewerStatus = 'NONE' | 'PENDING' | 'FOLLOWING' | 'FOLLOWED_BY' | 'MUTUAL'

export interface FollowStatusResponse {
  followStatus: FollowViewerStatus
}

export interface FollowRequest extends Author {
  notificationId: string | null
}

export type FollowRequestsResponse = ResponseWithCursor<FollowRequest>

export interface FollowRequestsCount {
  count: number
}
