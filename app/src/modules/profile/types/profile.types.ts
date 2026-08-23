import type { MediaType } from '~/common/constants/media-type'
import type { Subscription } from '~/modules/auth'

import type { FollowViewerStatus } from './follow.types'

export interface ProfileUser {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  bannerUrl: string | null
  subscription: Subscription
  isPrivate: boolean
}

export type RatingDistribution = Record<number, number>

export interface ReviewStats {
  total: number
  byMediaType: Record<MediaType, number>
}

export interface UserActivity {
  date: string
  count: number
}

export interface Profile {
  user: ProfileUser
  followStatus: FollowViewerStatus
  followersCount: number
  followingCount: number
  ratingDistribution: RatingDistribution | null
  reviewStats: ReviewStats | null
}
