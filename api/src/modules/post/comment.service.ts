import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { buildCommentInclude, mapComment } from './post.query'
import { CommentItem, CommentListResponse, LikeResponse } from './types/post.types'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'

@Injectable()
export class CommentService {
  private readonly REPLIES_LIMIT = 20

  constructor(private readonly prisma: PrismaService) {}

  async createComment(postId: string, userId: string, dto: CreateCommentDto): Promise<CommentItem> {
    await this.ensurePostExists(postId)

    const comment = await this.prisma.comment.create({
      data: {
        postId,
        userId,
        content: dto.content,
      },
      include: buildCommentInclude(userId),
    })

    return mapComment(comment)
  }

  async listReplies(
    commentId: string,
    cursor?: string,
    userId?: string,
  ): Promise<CommentListResponse> {
    await this.ensureCommentExists(commentId)

    const replies = await this.prisma.comment.findMany({
      where: {
        parentId: commentId,
      },
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      take: this.REPLIES_LIMIT + 1,
      include: buildCommentInclude(userId),
    })

    const hasNextPage = replies.length > this.REPLIES_LIMIT

    if (hasNextPage) {
      replies.pop()
    }

    return {
      data: replies.map(mapComment),
      nextCursor: hasNextPage ? replies[replies.length - 1].id : null,
    }
  }

  async createReply(
    commentId: string,
    userId: string,
    dto: CreateCommentDto,
  ): Promise<CommentItem> {
    const parent = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: { postId: true, parentId: true, deletedAt: true },
    })

    if (!parent || parent.deletedAt) {
      throw new NotFoundException('Comment not found')
    }

    if (parent.parentId) {
      throw new BadRequestException('Cannot reply to a reply')
    }

    await this.ensurePostExists(parent.postId)

    const reply = await this.prisma.comment.create({
      data: {
        postId: parent.postId,
        userId,
        parentId: commentId,
        content: dto.content,
      },
      include: buildCommentInclude(userId),
    })

    return mapComment(reply)
  }

  async updateComment(
    commentId: string,
    userId: string,
    dto: UpdateCommentDto,
  ): Promise<CommentItem> {
    if (dto.content === undefined) {
      throw new BadRequestException('No fields to update')
    }

    const existing = await this.prisma.comment.findFirst({
      where: { id: commentId, userId },
      select: { deletedAt: true },
    })

    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Comment not found')
    }

    const comment = await this.prisma.comment.update({
      where: { id: commentId },
      data: { content: dto.content },
      include: buildCommentInclude(userId),
    })

    return mapComment(comment)
  }

  async deleteComment(commentId: string, userId: string): Promise<CommentItem> {
    const existing = await this.prisma.comment.findFirst({
      where: { id: commentId, userId },
      select: { id: true, deletedAt: true },
    })

    if (!existing) {
      throw new NotFoundException('Comment not found')
    }

    if (existing.deletedAt) {
      const comment = await this.prisma.comment.findUnique({
        where: { id: commentId },
        include: buildCommentInclude(userId),
      })

      if (!comment) {
        throw new NotFoundException('Comment not found')
      }

      return mapComment(comment)
    }

    const comment = await this.prisma.comment.update({
      where: { id: commentId },
      data: { deletedAt: new Date() },
      include: buildCommentInclude(userId),
    })

    return mapComment(comment)
  }

  async likeComment(commentId: string, userId: string): Promise<LikeResponse> {
    await this.ensureCommentExists(commentId)

    await this.prisma.commentLike.createMany({
      data: [{ commentId, userId }],
      skipDuplicates: true,
    })

    return { success: true }
  }

  async unlikeComment(commentId: string, userId: string): Promise<LikeResponse> {
    await this.ensureCommentExists(commentId)

    await this.prisma.commentLike.deleteMany({
      where: { commentId, userId },
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

  private async ensureCommentExists(commentId: string): Promise<void> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, deletedAt: true },
    })

    if (!comment || comment.deletedAt) {
      throw new NotFoundException('Comment not found')
    }
  }
}
