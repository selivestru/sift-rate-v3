import { PaginationCursorResponse } from '~/common/types/pagination-cursor.types'
import { Author } from '~/common/types/user.types'
import { Comment, Media, Post, Review } from '~/generated/prisma/client'

export interface PostWithIncludes extends Post {
  user: Author
  review: (Review & { media: Media }) | null
  _count: {
    likes: number
    comments: number
  }
  likes?: { id: string }[]
}

export interface CommentWithIncludes extends Comment {
  user: Author
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
  createdAt: Date
  user: Author
  review: PostWithIncludes['review']
  likesCount: number
  commentsCount: number
  isLiked: boolean
}

export interface CommentItem {
  id: string
  content: string | null
  deleted: boolean
  createdAt: Date
  updatedAt: Date
  author: Author
  likesCount: number
  isLiked: boolean
  repliesCount: number
}

export type CommentListResponse = PaginationCursorResponse<CommentItem>

export interface LikeResponse {
  success: boolean
}
