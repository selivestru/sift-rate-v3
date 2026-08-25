import type { MediaType } from '~/common/constants/media-type'

export interface ProfileUser {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
}

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
  ratingDistribution: Record<number, number>
  reviewStats: ReviewStats
}
