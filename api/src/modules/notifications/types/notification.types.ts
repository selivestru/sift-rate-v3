import { NotificationType } from '~/generated/prisma/enums'

export type NotificationPayloadMap = {
  [NotificationType.FOLLOW]: { userId: string }
}

export type NotificationPayload<K extends NotificationType = NotificationType> =
  NotificationPayloadMap[K]

export type NotificationResponsePayloadMap = {
  [NotificationType.FOLLOW]: {
    id: string
    username: string | null
    displayName: string | null
    avatarUrl: string | null
  }
}

export type NotificationDto<K extends NotificationType = NotificationType> = {
  id: string
  type: K
  payload: NotificationResponsePayloadMap[K]
  readAt: string | null
  createdAt: string
}
