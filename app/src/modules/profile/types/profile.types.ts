import type { MediaType } from '~/common/constants/media-type'
import type { Subscription } from '~/modules/auth'
import type { ReviewMediaCard } from '~/modules/review'

export interface ProfileResponse {
  id: string
}

export interface ProfileUser {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  bannerUrl: string | null
  subscription: Subscription
  createdAt: string
}

export type RatingDistribution = Record<number, number>

export interface ReviewStats {
  total: number
  byMediaType: Record<MediaType, number>
}

export interface ReviewActivityDay {
  date: string
  count: number
}

export type ReviewActivityByYear = Record<number, ReviewActivityDay[]>

export interface FeedAuthor {
  username: string
  displayName: string
  avatarUrl: string | null
}

export interface FeedItemBase {
  id: string
  author: FeedAuthor
  createdAt: string
  likeCount: number
  commentCount: number
  isLiked: boolean
}

export interface ReviewFeedItem extends FeedItemBase {
  kind: 'review'
  rating: number
  content: string | null
  media: ReviewMediaCard
}

export interface PostFeedItem extends FeedItemBase {
  kind: 'post'
  content: string
  media?: ReviewMediaCard
}

export type FeedItem = ReviewFeedItem | PostFeedItem

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
  achievements: Achievement[]
  ratingDistribution: RatingDistribution
  reviewStats: ReviewStats
  reviewActivity: ReviewActivityByYear
  feed: FeedItem[]
}
