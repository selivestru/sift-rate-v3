import { PostItem, PostWithIncludes } from './types/post.types'
import { AUTHOR_SELECT } from '~/common/constants/author-select'
import { Prisma } from '~/generated/prisma/client'

export const buildPostInclude = (userId?: string) =>
  ({
    review: {
      include: {
        media: true,
      },
    },
    user: {
      select: AUTHOR_SELECT,
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
  }) satisfies Prisma.PostInclude

export const mapPost = (post: PostWithIncludes): PostItem => ({
  id: post.id,
  content: post.deletedAt ? null : post.content,
  userId: post.userId,
  reviewId: post.reviewId,
  parentId: post.parentId,
  rootId: post.rootId,
  deleted: post.deletedAt !== null,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
  user: post.user,
  review: post.review,
  likesCount: post._count.likes,
  isLiked: (post.likes?.length ?? 0) > 0,
  repliesCount: post._count.replies,
})
