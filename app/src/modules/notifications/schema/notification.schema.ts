import { z } from 'zod'

import { NOTIFICATION_TYPE } from '../types/notification.types'

const notificationActorSchema = z.object({
  id: z.string(),
  username: z.string().nullable(),
  displayName: z.string().nullable(),
  avatarUrl: z.string().nullable(),
})

const postRefSchema = z.object({
  id: z.string().nullable(),
  content: z.string().nullable(),
})

const notificationDtoBaseSchema = z.object({
  id: z.string(),
  readAt: z.string().nullable(),
  createdAt: z.string(),
})

const passwordChangedNotificationSchema = notificationDtoBaseSchema.extend({
  type: z.literal(NOTIFICATION_TYPE.PASSWORD_CHANGED),
  payload: z.null(),
})

const emailChangedNotificationSchema = notificationDtoBaseSchema.extend({
  type: z.literal(NOTIFICATION_TYPE.EMAIL_CHANGED),
  payload: z.null(),
})

const followNotificationSchema = notificationDtoBaseSchema.extend({
  type: z.literal(NOTIFICATION_TYPE.FOLLOW),
  payload: notificationActorSchema,
})

const followRequestNotificationSchema = notificationDtoBaseSchema.extend({
  type: z.literal(NOTIFICATION_TYPE.FOLLOW_REQUEST),
  payload: notificationActorSchema,
})

const followRequestAcceptedNotificationSchema = notificationDtoBaseSchema.extend({
  type: z.literal(NOTIFICATION_TYPE.FOLLOW_REQUEST_ACCEPTED),
  payload: notificationActorSchema,
})

const postLikeNotificationSchema = notificationDtoBaseSchema.extend({
  type: z.literal(NOTIFICATION_TYPE.POST_LIKE),
  payload: z.object({ user: notificationActorSchema, post: postRefSchema }),
})

const postCommentNotificationSchema = notificationDtoBaseSchema.extend({
  type: z.literal(NOTIFICATION_TYPE.POST_COMMENT),
  payload: z.object({
    user: notificationActorSchema,
    post: postRefSchema,
    comment: postRefSchema,
  }),
})

export const notificationSchema = z.discriminatedUnion('type', [
  passwordChangedNotificationSchema,
  emailChangedNotificationSchema,
  followNotificationSchema,
  followRequestNotificationSchema,
  followRequestAcceptedNotificationSchema,
  postLikeNotificationSchema,
  postCommentNotificationSchema,
])

export type Notification = z.infer<typeof notificationSchema>
export type FollowNotification = z.infer<typeof followNotificationSchema>
export type FollowRequestNotification = z.infer<typeof followRequestNotificationSchema>
export type FollowRequestAcceptedNotification = z.infer<
  typeof followRequestAcceptedNotificationSchema
>
export type PostLikeNotification = z.infer<typeof postLikeNotificationSchema>
export type PostCommentNotification = z.infer<typeof postCommentNotificationSchema>
