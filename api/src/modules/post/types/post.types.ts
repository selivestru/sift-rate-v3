import { PaginationCursorResponse } from '~/common/types/pagination-cursor.types'
import { Author } from '~/common/types/user.types'
import { Media, Post, Review } from '~/generated/prisma/client'

export interface PostWithIncludes extends Post {
  user: Author
  review: (Review & { media: Media }) | null
  _count: {
    likes: number
    replies: number
  }
  likes?: { id: string }[]
}

export interface PostItem {
  id: string
  content: string | null
  userId: string
  reviewId: string | null
  parentId: string | null
  rootId: string | null
  deleted: boolean
  createdAt: Date
  updatedAt: Date
  user: Author
  review: PostWithIncludes['review']
  likesCount: number
  isLiked: boolean
  repliesCount: number
}

export type PostListResponse = PaginationCursorResponse<PostItem>

export interface LikeResponse {
  success: boolean
}
