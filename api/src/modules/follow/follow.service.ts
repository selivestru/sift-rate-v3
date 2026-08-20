import { BadRequestException, Injectable } from '@nestjs/common'

import { UserService } from '../user/user.service'
import { Author } from '~/common/types/user.types'
import { NotificationType } from '~/generated/prisma/enums'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'
import { NotificationsService } from '~/modules/notifications/notifications.service'

@Injectable()
export class FollowService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UserService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async follow(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself')
    }

    await this.userService.findById(followingId)

    const isFollowing = await this.isFollowing(followerId, followingId)

    if (isFollowing) {
      throw new BadRequestException('Already following')
    }

    await this.prisma.follow.create({
      data: { followerId, followingId },
    })

    await this.notificationsService.create(followingId, NotificationType.FOLLOW, {
      userId: followerId,
    })
  }

  async unfollow(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot unfollow yourself')
    }

    await this.userService.findById(followingId)

    const isFollowing = await this.isFollowing(followerId, followingId)

    if (!isFollowing) {
      throw new BadRequestException('Not following')
    }

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
