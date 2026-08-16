import { CommentItem, CommentWithIncludes, PostItem, PostWithIncludes } from './types/post.types'
import { Prisma } from '~/generated/prisma/client'

export const buildPostInclude = (userId?: string) =>
  ({
    review: {
      include: {
        media: true,
      },
    },
    user: {
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
      },
    },
    _count: {
      select: {
        likes: true,
        comments: {
          where: {
            deletedAt: null,
          },
        },
      },
    },
    likes: {
      where: { userId: userId ?? '' },
      select: { id: true },
    },
  }) satisfies Prisma.PostInclude

export const mapPost = (post: PostWithIncludes): PostItem => ({
  id: post.id,
  content: post.content,
  userId: post.userId,
  reviewId: post.reviewId,
  createdAt: post.createdAt,
  user: post.user,
  review: post.review,
  likesCount: post._count.likes,
  commentsCount: post._count.comments,
  isLiked: (post.likes?.length ?? 0) > 0,
})

export const buildCommentInclude = (userId?: string) =>
  ({
    user: {
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
      },
    },
    _count: {
      select: {
        likes: true,
        replies: {
          where: {
            deletedAt: null,
          },
        },
      },
    },
    likes: {
      where: { userId: userId ?? '' },
      select: { id: true },
    },
  }) satisfies Prisma.CommentInclude

export const mapComment = (comment: CommentWithIncludes): CommentItem => ({
  id: comment.id,
  content: comment.deletedAt ? null : comment.content,
  deleted: comment.deletedAt !== null,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,
  author: comment.user,
  likesCount: comment._count.likes,
  isLiked: (comment.likes?.length ?? 0) > 0,
  repliesCount: comment._count.replies,
})
