import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common'

import { UserService } from '../user/user.service'
import { FeedResponse } from './types/feed.types'
import { DEFAULT_PAGE_SIZE } from '~/common/constants/pagination'
import { Prisma } from '~/generated/prisma/client'
import { FollowStatus } from '~/generated/prisma/enums'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'
import { buildPostInclude, mapPost } from '~/modules/post/post.query'

@Injectable()
export class FeedService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async getFeed(userId?: string, cursor?: string): Promise<FeedResponse> {
    return this.fetchPosts(userId, cursor, {
      user: {
        OR: [
          { isPrivate: false },
          ...(userId
            ? [{ followers: { some: { followerId: userId, status: FollowStatus.ACCEPTED } } }]
            : []),
        ],
      },
    })
  }

  async getFollowingFeed(userId: string, cursor?: string): Promise<FeedResponse> {
    return this.fetchPosts(userId, cursor, {
      user: {
        followers: {
          some: {
            followerId: userId,
            status: FollowStatus.ACCEPTED,
          },
        },
      },
    })
  }

  async getUserFeed(username: string, userId?: string, cursor?: string): Promise<FeedResponse> {
    const user = await this.userService.findByUsername(username)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return this.fetchPosts(userId, cursor, {
      userId: user.id,
    })
  }

  private async fetchPosts(
    userId?: string,
    cursor?: string,
    where?: Prisma.PostWhereInput,
  ): Promise<FeedResponse> {
    const posts = await this.prisma.post.findMany({
      where: {
        ...where,
        deletedAt: null,
        parentId: null,
      },
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: {
        createdAt: 'desc',
      },
      take: DEFAULT_PAGE_SIZE + 1,
      include: buildPostInclude(userId),
    })

    const hasNextPage = posts.length > DEFAULT_PAGE_SIZE

    if (hasNextPage) {
      posts.pop()
    }

    return {
      data: posts.map(mapPost),
      nextCursor: hasNextPage ? posts[posts.length - 1].id : null,
    }
  }
}
