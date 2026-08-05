import type { MediaType } from '~/common/constants/media-type'
import type { Subscription } from '~/modules/auth'

export interface ProfileUser {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  bannerUrl: string | null
  subscription: Subscription
  createdAt: string
}

export interface ProfileStats {
  friends: number
  reviews: number
  rankedLists: number
}

export type RatingDistribution = Record<number, number>

export interface ReviewStats {
  total: number
  byMediaType: Partial<Record<MediaType, number>>
}

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface Achievement {
  id: string
  title: string
  description: string
  iconName: string
  rarity: AchievementRarity
  unlockedAt: string | null
}

export interface Profile {
  user: ProfileUser
  stats: ProfileStats
  ratingDistribution: RatingDistribution
  reviewStats: ReviewStats
  achievements: Achievement[]
}
