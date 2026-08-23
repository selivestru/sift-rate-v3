import { Key2, Mailbox } from 'reicon-react'

import { Avatar, AvatarFallback, AvatarImage } from '~/common/ui/Avatar'
import { getFirstLetter } from '~/common/utils/getFirstLetter'

import type {
  FollowNotification,
  FollowRequestAcceptedNotification,
  FollowRequestNotification,
  Notification,
  PostCommentNotification,
  PostLikeNotification,
} from '../schema/notification.schema'

export type NotificationTarget =
  | { to: '/$username'; params: { username: string } }
  | { to: '/post/$postId'; params: { postId: string } }

type ActorNotification =
  | FollowNotification
  | FollowRequestNotification
  | FollowRequestAcceptedNotification

type NotificationActor = ActorNotification['payload']

interface NotificationMetaBase {
  icon: React.ReactNode
  title: string
  description: string
  target?: NotificationTarget
}

export type NotificationMeta = NotificationMetaBase

const actorName = (actor: NotificationActor) => actor.username ?? actor.displayName ?? 'Someone'

const actorAvatar = (actor: NotificationActor) => {
  const name = actorName(actor)

  return (
    <Avatar size="lg">
      <AvatarImage src={actor.avatarUrl ?? undefined} alt={name} />
      <AvatarFallback>{getFirstLetter(name)}</AvatarFallback>
    </Avatar>
  )
}

const userTarget = (username: string | null): NotificationTarget | undefined =>
  username ? { to: '/$username', params: { username } } : undefined

const postTarget = (postId: string | null): NotificationTarget | undefined =>
  postId ? { to: '/post/$postId', params: { postId } } : undefined

const actorNotificationMeta = (
  notification: ActorNotification,
  description: string,
): NotificationMeta => {
  const { payload } = notification
  const name = actorName(payload)

  return {
    icon: actorAvatar(payload),
    title: `@${name}`,
    description,
    target: userTarget(payload.username),
  }
}

const postLikeNotificationMeta = (notification: PostLikeNotification): NotificationMeta => {
  const { payload } = notification
  const name = actorName(payload.user)

  return {
    icon: actorAvatar(payload.user),
    title: `@${name}`,
    description: 'liked your post',
    target: postTarget(payload.post.id),
  }
}

const postCommentNotificationMeta = (notification: PostCommentNotification): NotificationMeta => {
  const { payload } = notification
  const name = actorName(payload.user)

  return {
    icon: actorAvatar(payload.user),
    title: `@${name}`,
    description: 'commented on your post',
    target: postTarget(payload.comment.id),
  }
}

const systemNotificationMeta = (
  icon: React.ReactNode,
  title: string,
  description: string,
): NotificationMeta => ({
  icon: (
    <span className="bg-accent text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
      {icon}
    </span>
  ),
  title,
  description,
})

export const getNotificationMeta = (notification: Notification): NotificationMeta => {
  switch (notification.type) {
    case 'PASSWORD_CHANGED':
      return systemNotificationMeta(
        <Key2 className="size-5" strokeWidth={1.75} aria-hidden />,
        'Password changed',
        'Your password was updated',
      )
    case 'EMAIL_CHANGED':
      return systemNotificationMeta(
        <Mailbox className="size-5" strokeWidth={1.75} aria-hidden />,
        'Email changed',
        'Your email address was updated',
      )
    case 'FOLLOW':
      return actorNotificationMeta(notification, 'started following you')
    case 'FOLLOW_REQUEST':
      return actorNotificationMeta(notification, 'sent you a follow request')
    case 'FOLLOW_REQUEST_ACCEPTED':
      return actorNotificationMeta(notification, 'accepted your follow request')
    case 'POST_LIKE':
      return postLikeNotificationMeta(notification)
    case 'POST_COMMENT':
      return postCommentNotificationMeta(notification)
  }
}
