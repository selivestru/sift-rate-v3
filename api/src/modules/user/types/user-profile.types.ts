import { SafeUser } from './user.types'
import { MediaType } from '~/generated/prisma/enums'

export interface ReviewStats {
  total: number
  byMediaType: Record<MediaType, number>
}

export interface ReviewActivity {
  date: string
  count: number
}

export interface UserProfile {
  user: Omit<SafeUser, 'createdAt' | 'email'>
  ratingDistribution: Record<string, number>
  reviewStats: ReviewStats
}
