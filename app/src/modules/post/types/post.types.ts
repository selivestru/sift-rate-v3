import type { Review } from '~/modules/review'

export interface Author {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
}

export interface Post {
  id: string
  content: string | null
  userId: string
  reviewId: string | null
  createdAt: string
  user: Author
  review: Review | null
  likesCount: number
  commentsCount: number
  isLiked: boolean
}

export interface LikePostResponse {
  success: boolean
}
