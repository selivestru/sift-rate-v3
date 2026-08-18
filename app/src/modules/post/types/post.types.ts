import type { ResponseWithCursor } from '~/common/types/response-with-cursor.types'
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
  updatedAt: string
  user: Author
  review: Review | null
  likesCount: number
  repliesCount: number
  isLiked: boolean
  parentId: string | null
  rootId: string | null
}

export interface LikePostResponse {
  success: boolean
}

export type PostListResponse = ResponseWithCursor<Post>
