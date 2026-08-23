export type FollowViewerStatus = 'NONE' | 'PENDING' | 'FOLLOWING' | 'FOLLOWED_BY' | 'MUTUAL'

export interface FollowStatusResponse {
  followStatus: FollowViewerStatus
}
