import { Author } from '~/common/types/user.types'

export type FollowViewerStatus = 'NONE' | 'PENDING' | 'FOLLOWING' | 'FOLLOWED_BY' | 'MUTUAL'

export interface FollowStatusResponse {
  followStatus: FollowViewerStatus
}

export interface FollowRequest extends Author {
  notificationId: string | null
}
