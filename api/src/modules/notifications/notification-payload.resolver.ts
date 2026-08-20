import { Injectable } from '@nestjs/common'

import { NotificationPayloadMap, NotificationResponsePayloadMap } from './types/notification.types'
import type { Author } from '~/common/types/user.types'
import { NotificationType } from '~/generated/prisma/enums'
import type { NotificationModel } from '~/generated/prisma/models'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'

@Injectable()
export class NotificationPayloadResolverService {
  constructor(private readonly prisma: PrismaService) {}

  async resolve(
    rows: NotificationModel[],
  ): Promise<NotificationResponsePayloadMap[NotificationType][]> {
    const payloads = new Array<NotificationResponsePayloadMap[NotificationType]>(rows.length)
    const groups = new Map<NotificationType, number[]>()

    rows.forEach((row, index) => {
      const indices = groups.get(row.type)

      if (indices) {
        indices.push(index)
      } else {
        groups.set(row.type, [index])
      }
    })

    for (const [type, indices] of groups) {
      const typeRows = indices.map((index) => rows[index])
      const typePayloads = await this.resolveForType(type, typeRows)

      typePayloads.forEach((payload, i) => {
        payloads[indices[i]] = payload
      })
    }

    return payloads
  }

  private async resolveForType(
    type: NotificationType,
    rows: NotificationModel[],
  ): Promise<NotificationResponsePayloadMap[NotificationType][]> {
    switch (type) {
      case NotificationType.FOLLOW:
        return this.resolveFollow(rows)
    }
  }

  private async resolveFollow(
    rows: NotificationModel[],
  ): Promise<NotificationResponsePayloadMap[typeof NotificationType.FOLLOW][]> {
    const userIds: string[] = []

    for (const row of rows) {
      const { userId } = row.payload as NotificationPayloadMap['FOLLOW']
      userIds.push(userId)
    }

    let userMap = new Map<string, Author>()

    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
      },
    })

    userMap = new Map(users.map((user) => [user.id, user]))

    return rows.map((row) => {
      const { userId } = row.payload as NotificationPayloadMap['FOLLOW']
      const user = userMap.get(userId)

      return {
        id: userId,
        username: user?.username ?? null,
        displayName: user?.displayName ?? null,
        avatarUrl: user?.avatarUrl ?? null,
      }
    })
  }
}
