import type { ResponseWithCursor } from '~/common/types/response-with-cursor.types'
import type { Author } from '~/modules/post'

export const NOTIFICATION_TYPE = {
  FOLLOW: 'FOLLOW',
} as const

export type NotificationType = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE]

export type NotificationPayloadMap = {
  [NOTIFICATION_TYPE.FOLLOW]: Author
}

export type NotificationPayload<K extends NotificationType = NotificationType> =
  NotificationPayloadMap[K]

export interface NotificationDto<K extends NotificationType = NotificationType> {
  id: string
  type: K
  payload: NotificationPayload<K>
  readAt: string | null
  createdAt: string
}

export type NotificationsResponse = ResponseWithCursor<NotificationDto>

export interface NotificationUnreadCount {
  count: number
}
