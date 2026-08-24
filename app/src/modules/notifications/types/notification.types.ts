import type { ResponseWithCursor } from '~/common/types/response-with-cursor.types'

export const NOTIFICATION_TYPE = {
  PASSWORD_CHANGED: 'PASSWORD_CHANGED',
  EMAIL_CHANGED: 'EMAIL_CHANGED',
  FOLLOW: 'FOLLOW',
  FOLLOW_REQUEST: 'FOLLOW_REQUEST',
  FOLLOW_REQUEST_ACCEPTED: 'FOLLOW_REQUEST_ACCEPTED',
  POST_LIKE: 'POST_LIKE',
  POST_COMMENT: 'POST_COMMENT',
} as const

export type NotificationType = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE]

export interface PostRef {
  id: string | null
  content: string | null
  review: { content: string | null; rating: number; mediaTitle: string } | null
}

export interface NotificationActor {
  id: string | null
  username: string | null
  displayName: string | null
  avatarUrl: string | null
}

export type NotificationPayloadMap = {
  [NOTIFICATION_TYPE.PASSWORD_CHANGED]: null
  [NOTIFICATION_TYPE.EMAIL_CHANGED]: null
  [NOTIFICATION_TYPE.FOLLOW]: NotificationActor
  [NOTIFICATION_TYPE.FOLLOW_REQUEST]: NotificationActor
  [NOTIFICATION_TYPE.FOLLOW_REQUEST_ACCEPTED]: NotificationActor
  [NOTIFICATION_TYPE.POST_LIKE]: { user: NotificationActor; post: PostRef }
  [NOTIFICATION_TYPE.POST_COMMENT]: { user: NotificationActor; post: PostRef; comment: PostRef }
}

export type NotificationPayload<K extends NotificationType = NotificationType> =
  NotificationPayloadMap[K]

export type NotificationDto<K extends NotificationType = NotificationType> = {
  [P in K]: {
    id: string
    type: P
    payload: NotificationPayloadMap[P]
    readAt: string | null
    createdAt: string
  }
}[K]

export type NotificationsResponse = ResponseWithCursor<NotificationDto>

export interface NotificationUnreadCount {
  count: number
}
