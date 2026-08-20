import type { LinkProps, RegisteredRouter } from '@tanstack/react-router'

import { Avatar, AvatarFallback, AvatarImage } from '~/common/ui/Avatar'
import { getFirstLetter } from '~/common/utils/getFirstLetter'

import type { FollowNotification, Notification } from '../schema/notification.schema'

type LinkTarget<TTo extends string> = Pick<
  LinkProps<'a', RegisteredRouter, '/', TTo>,
  'to' | 'params'
>

interface NotificationMetaBase {
  icon: React.ReactNode
  title: string
  description: string
}

interface FollowNotificationMeta extends NotificationMetaBase {
  target?: LinkTarget<'/$username'>
}

export type NotificationMeta = FollowNotificationMeta

const followNotificationMeta = (notification: FollowNotification): FollowNotificationMeta => {
  const { payload } = notification
  const name = payload.username ?? payload.displayName ?? 'Someone'

  return {
    icon: (
      <Avatar size="lg">
        <AvatarImage src={payload.avatarUrl ?? undefined} alt={name} />
        <AvatarFallback>{getFirstLetter(name)}</AvatarFallback>
      </Avatar>
    ),
    title: `@${name}`,
    description: 'started following you',
    target: payload.username
      ? { to: '/$username', params: { username: payload.username } }
      : undefined,
  }
}

export const getNotificationMeta = (notification: Notification): NotificationMeta => {
  switch (notification.type) {
    case 'FOLLOW':
      return followNotificationMeta(notification)
  }
}
