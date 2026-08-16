import { Injectable, NotFoundException } from '@nestjs/common'

import { buildCommentInclude, buildPostInclude, mapComment, mapPost } from './post.query'
import { CommentListResponse, LikeResponse, PostItem } from './types/post.types'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'

@Injectable()
export class PostService {
  private readonly COMMENTS_LIMIT = 20

  constructor(private readonly prisma: PrismaService) {}

  async getPostById(postId: string, userId?: string): Promise<PostItem> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: buildPostInclude(userId),
    })

    if (!post) {
      throw new NotFoundException('Post not found')
    }

    return mapPost(post)
  }

  async listComments(
    postId: string,
    cursor?: string,
    userId?: string,
  ): Promise<CommentListResponse> {
    await this.ensurePostExists(postId)

    const comments = await this.prisma.comment.findMany({
      where: {
        postId,
        parentId: null,
      },
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: this.COMMENTS_LIMIT + 1,
      include: buildCommentInclude(userId),
    })

    const hasNextPage = comments.length > this.COMMENTS_LIMIT

    if (hasNextPage) {
      comments.pop()
    }

    return {
      data: comments.map(mapComment),
      nextCursor: hasNextPage ? comments[comments.length - 1].id : null,
    }
  }

  async likePost(postId: string, userId: string): Promise<LikeResponse> {
    await this.ensurePostExists(postId)

    await this.prisma.postLike.createMany({
      data: [{ postId, userId }],
      skipDuplicates: true,
    })

    return { success: true }
  }

  async unlikePost(postId: string, userId: string): Promise<LikeResponse> {
    await this.ensurePostExists(postId)

    await this.prisma.postLike.deleteMany({
      where: { postId, userId },
    })

    return { success: true }
  }

  private async ensurePostExists(postId: string): Promise<void> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    })

    if (!post) {
      throw new NotFoundException('Post not found')
    }
  }
}
