import { Injectable } from '@nestjs/common'

import { NotificationPayloadResolverService } from './notification-payload.resolver'
import { NotificationsStreamService } from './notifications-stream.service'
import {
  NotificationDto,
  NotificationPayload,
  NotificationResponsePayloadMap,
} from './types/notification.types'
import { DEFAULT_PAGE_SIZE } from '~/common/constants/pagination'
import { PaginationCursorResponse } from '~/common/types/pagination-cursor.types'
import { NotificationType } from '~/generated/prisma/enums'
import type { NotificationModel } from '~/generated/prisma/models'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stream: NotificationsStreamService,
    private readonly payloadResolver: NotificationPayloadResolverService,
  ) {}

  async create(
    recipientId: string,
    type: NotificationType,
    payload: NotificationPayload<typeof type>,
  ): Promise<void> {
    const notification = await this.prisma.notification.create({
      data: {
        userId: recipientId,
        type,
        payload,
      },
    })

    const [resolvedPayload] = await this.payloadResolver.resolve([notification])

    this.stream.emit(recipientId, this.toDto(notification, resolvedPayload))
  }

  async getNotifications(
    userId: string,
    cursor?: string,
  ): Promise<PaginationCursorResponse<NotificationDto>> {
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: DEFAULT_PAGE_SIZE + 1,
    })

    const hasNextPage = notifications.length > DEFAULT_PAGE_SIZE

    if (hasNextPage) {
      notifications.pop()
    }

    const data = await this.toDtos(notifications)

    return {
      data,
      nextCursor: hasNextPage ? notifications[notifications.length - 1].id : null,
    }
  }

  async unreadCount(userId: string): Promise<{ count: number }> {
    const count = await this.prisma.notification.count({
      where: { userId, readAt: null },
    })

    return { count }
  }

  async markRead(userId: string, notificationIds: string[]): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId, id: { in: notificationIds }, readAt: null },
      data: { readAt: new Date() },
    })
  }

  async markAllRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    })
  }

  private async toDtos(rows: NotificationModel[]): Promise<NotificationDto[]> {
    const payloads = await this.payloadResolver.resolve(rows)

    return rows.map((row, index) => this.toDto(row, payloads[index]))
  }

  private toDto(
    row: NotificationModel,
    payload: NotificationResponsePayloadMap[NotificationType],
  ): NotificationDto {
    return {
      id: row.id,
      type: row.type,
      payload,
      readAt: row.readAt ? row.readAt.toISOString() : null,
      createdAt: row.createdAt.toISOString(),
    }
  }
}
