import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common'

import { UserService } from '../user/user.service'
import { FeedResponse } from './types/feed.types'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'

@Injectable()
export class FeedService {
  private readonly POSTS_LIMIT = 20

  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async getFeed(cursor?: string): Promise<FeedResponse> {
    const posts = await this.prisma.post.findMany({
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: {
        createdAt: 'desc',
      },
      take: this.POSTS_LIMIT + 1,
      include: {
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
      },
    })

    const hasNextPage = posts.length > this.POSTS_LIMIT

    if (hasNextPage) {
      posts.pop()
    }

    return {
      data: posts,
      nextCursor: hasNextPage ? posts[posts.length - 1].id : null,
    }
  }

  async getFollowingFeed(userId: string, cursor?: string): Promise<FeedResponse> {
    const posts = await this.prisma.post.findMany({
      where: {
        user: {
          followers: {
            some: {
              followerId: userId,
            },
          },
        },
      },
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: {
        createdAt: 'desc',
      },
      take: this.POSTS_LIMIT + 1,
      include: {
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
      },
    })

    const hasNextPage = posts.length > this.POSTS_LIMIT

    if (hasNextPage) {
      posts.pop()
    }

    return {
      data: posts,
      nextCursor: hasNextPage ? posts[posts.length - 1].id : null,
    }
  }

  async getUserFeed(username: string, cursor?: string): Promise<FeedResponse> {
    const user = await this.userService.findByUsername(username)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const posts = await this.prisma.post.findMany({
      where: {
        userId: user.id,
      },
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: {
        createdAt: 'desc',
      },
      take: this.POSTS_LIMIT + 1,
      include: {
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
      },
    })

    const hasNextPage = posts.length > this.POSTS_LIMIT

    if (hasNextPage) {
      posts.pop()
    }

    return {
      data: posts,
      nextCursor: hasNextPage ? posts[posts.length - 1].id : null,
    }
  }
}
