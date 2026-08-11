import { BadRequestException, Injectable } from '@nestjs/common'

import { UserService } from '../user/user.service'
import { Author } from '~/common/types/user.types'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'

@Injectable()
export class FollowService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async follow(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself')
    }

    await this.userService.findById(followingId)

    await this.prisma.follow.upsert({
      where: {
        followerId_followingId: { followerId, followingId },
      },
      create: { followerId, followingId },
      update: {},
    })
  }

  async unfollow(followerId: string, followingId: string): Promise<void> {
    await this.prisma.follow.deleteMany({
      where: { followerId, followingId },
    })
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    })

    return !!follow
  }

  async getFollowing(userId: string): Promise<Author[]> {
    const rows = await this.prisma.follow.findMany({
      where: { followerId: userId },
      select: {
        following: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    })

    return rows.map((r) => r.following)
  }

  async getFollowers(userId: string): Promise<Author[]> {
    const rows = await this.prisma.follow.findMany({
      where: { followingId: userId },
      select: {
        follower: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    })

    return rows.map((r) => r.follower)
  }
}
