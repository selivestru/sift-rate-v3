import { Author } from '~/common/types/user.types'
import { NotificationType } from '~/generated/prisma/enums'

export interface NotificationPayloadMap {
  [NotificationType.PASSWORD_CHANGED]: null
  [NotificationType.EMAIL_CHANGED]: null
  [NotificationType.FOLLOW]: { userId: string }
  [NotificationType.FOLLOW_REQUEST]: { userId: string }
  [NotificationType.FOLLOW_REQUEST_ACCEPTED]: { userId: string }
  [NotificationType.POST_LIKE]: { postId: string; userId: string }
  [NotificationType.POST_COMMENT]: { postId: string; userId: string }
}

export type NotificationPayload<K extends NotificationType = NotificationType> =
  NotificationPayloadMap[K]

export interface PostRef {
  id: string | null
  content: string | null
}

export interface NotificationResponsePayloadMap {
  [NotificationType.PASSWORD_CHANGED]: null
  [NotificationType.EMAIL_CHANGED]: null
  [NotificationType.FOLLOW]: Author
  [NotificationType.FOLLOW_REQUEST]: Author
  [NotificationType.FOLLOW_REQUEST_ACCEPTED]: Author
  [NotificationType.POST_LIKE]: { user: Author; post: PostRef }
  [NotificationType.POST_COMMENT]: { user: Author; post: PostRef; comment: PostRef }
}

export interface NotificationDto<K extends NotificationType = NotificationType> {
  id: string
  type: K
  payload: NotificationResponsePayloadMap[K]
  readAt: string | null
  createdAt: string
}
