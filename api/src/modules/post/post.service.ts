import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

import { CreatePostDto } from './dto/create-post.dto'
import { ListRepliesQueryDto, REPLIES_SORT } from './dto/list-replies.query'
import { UpdatePostDto } from './dto/update-post.dto'
import { buildPostInclude, mapPost } from './post.query'
import { LikeResponse, PostItem, PostListResponse } from './types/post.types'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'

@Injectable()
export class PostService {
  private readonly REPLIES_LIMIT = 20

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

  async listReplies(
    postId: string,
    query: ListRepliesQueryDto,
    userId?: string,
  ): Promise<PostListResponse> {
    await this.ensurePostExists(postId)

    const replies = await this.prisma.post.findMany({
      where: {
        parentId: postId,
        deletedAt: null,
      },
      ...(query.cursor && {
        cursor: { id: query.cursor },
        skip: 1,
      }),
      orderBy:
        query.sort === REPLIES_SORT.OLDEST
          ? [{ createdAt: 'asc' }, { id: 'asc' }]
          : [{ createdAt: 'desc' }, { id: 'desc' }],
      take: this.REPLIES_LIMIT + 1,
      include: buildPostInclude(userId),
    })

    const hasNextPage = replies.length > this.REPLIES_LIMIT

    if (hasNextPage) {
      replies.pop()
    }

    return {
      data: replies.map(mapPost),
      nextCursor: hasNextPage ? replies[replies.length - 1].id : null,
    }
  }

  async createPost(userId: string, dto: CreatePostDto): Promise<PostItem> {
    const post = await this.prisma.post.create({
      data: {
        content: dto.content,
        userId,
      },
      include: buildPostInclude(userId),
    })

    return mapPost(post)
  }

  async createReply(postId: string, userId: string, dto: CreatePostDto): Promise<PostItem> {
    const parent = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, parentId: true, rootId: true, deletedAt: true },
    })

    if (!parent || parent.deletedAt) {
      throw new NotFoundException('Post not found')
    }

    const reply = await this.prisma.post.create({
      data: {
        content: dto.content,
        userId,
        parentId: parent.id,
        rootId: parent.rootId ?? parent.id,
      },
      include: buildPostInclude(userId),
    })

    return mapPost(reply)
  }

  async updatePost(postId: string, userId: string, dto: UpdatePostDto): Promise<PostItem> {
    if (dto.content === undefined) {
      throw new BadRequestException('No fields to update')
    }

    const existing = await this.prisma.post.findFirst({
      where: { id: postId, userId },
      select: { deletedAt: true },
    })

    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Post not found')
    }

    const post = await this.prisma.post.update({
      where: { id: postId },
      data: { content: dto.content },
      include: buildPostInclude(userId),
    })

    return mapPost(post)
  }

  async deletePost(postId: string, userId: string): Promise<PostItem> {
    const existing = await this.prisma.post.findFirst({
      where: { id: postId, userId },
      select: { id: true, deletedAt: true },
    })

    if (!existing) {
      throw new NotFoundException('Post not found')
    }

    if (existing.deletedAt) {
      const post = await this.prisma.post.findUnique({
        where: { id: postId },
        include: buildPostInclude(userId),
      })

      if (!post) {
        throw new NotFoundException('Post not found')
      }

      return mapPost(post)
    }

    const post = await this.prisma.post.update({
      where: { id: postId },
      data: { deletedAt: new Date() },
      include: buildPostInclude(userId),
    })

    return mapPost(post)
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
