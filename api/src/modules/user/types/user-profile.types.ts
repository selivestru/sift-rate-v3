import { SafeUser } from './user.types'
import { MediaType } from '~/generated/prisma/enums'
import { FollowViewerStatus } from '~/modules/follow/types/follow.types'

export interface ReviewStats {
  total: number
  byMediaType: Record<MediaType, number>
}

export interface ReviewActivity {
  date: string
  count: number
}

export interface UserProfile {
  user: Omit<SafeUser, 'isVerified' | 'method' | 'twoFactorEnabled' | 'createdAt' | 'email'>
  ratingDistribution: Record<string, number> | null
  reviewStats: ReviewStats | null
  followStatus: FollowViewerStatus
  followersCount: number
  followingCount: number
}
