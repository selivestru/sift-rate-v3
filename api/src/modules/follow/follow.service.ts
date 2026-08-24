import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common'

import { UserService } from '../user/user.service'
import { FollowRequest, FollowStatusResponse } from './types/follow.types'
import { AUTHOR_SELECT } from '~/common/constants/author-select'
import { DEFAULT_PAGE_SIZE } from '~/common/constants/pagination'
import { PaginationCursorResponse } from '~/common/types/pagination-cursor.types'
import { Author } from '~/common/types/user.types'
import { FollowStatus, NotificationType } from '~/generated/prisma/enums'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'
import { NotificationsService } from '~/modules/notifications/notifications.service'

@Injectable()
export class FollowService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async follow(followerId: string, followingId: string): Promise<FollowStatusResponse> {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself')
    }

    const target = await this.userService.findById(followingId)

    const existing = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    })

    if (existing?.status === FollowStatus.ACCEPTED) {
      throw new BadRequestException('Already following')
    }

    if (existing?.status === FollowStatus.PENDING) {
      throw new BadRequestException('Follow request already sent')
    }

    await this.prisma.follow.create({
      data: {
        followerId,
        followingId,
        status: target.isPrivate ? FollowStatus.PENDING : FollowStatus.ACCEPTED,
      },
    })

    const { followStatus } = await this.getFollowStatus(followerId, followingId)

    if (followStatus === 'FOLLOWING' || followStatus === 'MUTUAL') {
      await this.notificationsService.create(followingId, NotificationType.FOLLOW, {
        userId: followerId,
      })
    }

    if (followStatus === 'PENDING') {
      await this.notificationsService.create(followingId, NotificationType.FOLLOW_REQUEST, {
        userId: followerId,
      })
    }

    return { followStatus }
  }

  async unfollow(followerId: string, followingId: string): Promise<FollowStatusResponse> {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot unfollow yourself')
    }

    await this.userService.findById(followingId)

    const isFollowing = await this.isFollowing(followerId, followingId)

    if (!isFollowing) {
      const isPending = await this.isPending(followerId, followingId)

      if (!isPending) {
        throw new BadRequestException('Not following')
      }
    }

    await this.prisma.follow.deleteMany({
      where: { followerId, followingId },
    })

    if (isFollowing) {
      await this.notificationsService.delete(followingId, NotificationType.FOLLOW, {
        userId: followerId,
      })
    } else {
      await this.notificationsService.delete(followingId, NotificationType.FOLLOW_REQUEST, {
        userId: followerId,
      })
    }

    return this.getFollowStatus(followerId, followingId)
  }

  async getFollowRequests(
    userId: string,
    cursor?: string,
  ): Promise<PaginationCursorResponse<FollowRequest>> {
    const rows = await this.prisma.follow.findMany({
      where: { followingId: userId, status: FollowStatus.PENDING },
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: DEFAULT_PAGE_SIZE + 1,
      select: {
        id: true,
        follower: {
          select: AUTHOR_SELECT,
        },
      },
    })

    const hasNextPage = rows.length > DEFAULT_PAGE_SIZE

    if (hasNextPage) {
      rows.pop()
    }

    const notifications = await this.prisma.notification.findMany({
      where: { userId, type: NotificationType.FOLLOW_REQUEST },
      select: { id: true, payload: true },
    })

    const notificationIdByFollower = new Map<string, string>()

    for (const notification of notifications) {
      const payload = notification.payload as { userId: string } | null

      if (payload?.userId) {
        notificationIdByFollower.set(payload.userId, notification.id)
      }
    }

    return {
      data: rows.map((r) => ({
        ...r.follower,
        notificationId: notificationIdByFollower.get(r.follower.id) ?? null,
      })),
      nextCursor: hasNextPage ? rows[rows.length - 1].id : null,
    }
  }

  async getFollowRequestsCount(userId: string): Promise<{ count: number }> {
    const count = await this.prisma.follow.count({
      where: { followingId: userId, status: FollowStatus.PENDING },
    })

    return { count }
  }

  async acceptFollowRequest(targetId: string, followerId: string): Promise<void> {
    const result = await this.prisma.follow.updateMany({
      where: { followerId, followingId: targetId, status: FollowStatus.PENDING },
      data: { status: FollowStatus.ACCEPTED },
    })

    if (result.count === 0) {
      throw new BadRequestException('Follow request not found')
    }

    await this.notificationsService.create(followerId, NotificationType.FOLLOW_REQUEST_ACCEPTED, {
      userId: targetId,
    })

    await this.notificationsService.delete(targetId, NotificationType.FOLLOW_REQUEST, {
      userId: followerId,
    })
  }

  async rejectFollowRequest(targetId: string, followerId: string): Promise<void> {
    const result = await this.prisma.follow.deleteMany({
      where: { followerId, followingId: targetId, status: FollowStatus.PENDING },
    })

    if (result.count === 0) {
      throw new BadRequestException('Follow request not found')
    }

    await this.notificationsService.delete(targetId, NotificationType.FOLLOW_REQUEST, {
      userId: followerId,
    })
  }

  async getFollowStatus(viewerId: string, targetId: string): Promise<FollowStatusResponse> {
    if (viewerId === targetId) {
      return { followStatus: 'NONE' }
    }

    const [viewerToTarget, targetToViewer] = await Promise.all([
      this.prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: viewerId, followingId: targetId } },
      }),
      this.prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: targetId, followingId: viewerId } },
      }),
    ])

    if (viewerToTarget?.status === FollowStatus.ACCEPTED) {
      return { followStatus: targetToViewer ? 'MUTUAL' : 'FOLLOWING' }
    }

    if (viewerToTarget?.status === FollowStatus.PENDING) {
      return { followStatus: 'PENDING' }
    }

    return { followStatus: targetToViewer ? 'FOLLOWED_BY' : 'NONE' }
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    })

    return follow?.status === FollowStatus.ACCEPTED
  }

  async isPending(followerId: string, followingId: string): Promise<boolean> {
    const follow = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    })

    return follow?.status === FollowStatus.PENDING
  }

  async getFollowing(userId: string): Promise<Author[]> {
    const rows = await this.prisma.follow.findMany({
      where: { followerId: userId, status: FollowStatus.ACCEPTED },
      select: {
        following: {
          select: AUTHOR_SELECT,
        },
      },
    })

    return rows.map((r) => r.following)
  }

  async getFollowers(userId: string): Promise<Author[]> {
    const rows = await this.prisma.follow.findMany({
      where: { followingId: userId, status: FollowStatus.ACCEPTED },
      select: {
        follower: {
          select: AUTHOR_SELECT,
        },
      },
    })

    return rows.map((r) => r.follower)
  }
}
