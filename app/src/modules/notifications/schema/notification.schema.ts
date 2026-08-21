import { z } from 'zod'

import { NOTIFICATION_TYPE } from '../types/notification.types'

const notificationActorSchema = z.object({
  id: z.string(),
  username: z.string().nullable(),
  displayName: z.string().nullable(),
  avatarUrl: z.string().nullable(),
})

const notificationDtoBaseSchema = z.object({
  id: z.string(),
  readAt: z.string().nullable(),
  createdAt: z.string(),
})

const followNotificationSchema = notificationDtoBaseSchema.extend({
  type: z.literal(NOTIFICATION_TYPE.FOLLOW),
  payload: notificationActorSchema,
})

export const notificationSchema = z.discriminatedUnion('type', [followNotificationSchema])

export type Notification = z.infer<typeof notificationSchema>
export type FollowNotification = z.infer<typeof followNotificationSchema>
