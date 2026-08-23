import { Link } from '@tanstack/react-router'

import { cn } from '~/common/utils/cn'
import { formatRelativeTime } from '~/common/utils/formatRelativeTime'

import { useMarkReadMutation } from '../hooks/useMarkReadMutation'
import type { Notification } from '../schema/notification.schema'
import { getNotificationMeta } from '../utils/getNotificationMeta'

interface NotificationItemProps {
  notification: Notification
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const meta = getNotificationMeta(notification)
  const isUnread = notification.readAt === null

  const { mutate: markRead } = useMarkReadMutation()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (isUnread) {
      e.preventDefault()
      markRead([notification.id])
    }
  }

  const rowClassName = cn(
    'flex w-full items-center gap-3 px-4 py-4 text-left transition-colors duration-200 focus-visible:ring-ring/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset',
    isUnread && 'bg-muted',
    meta.target || isUnread ? 'cursor-pointer hover:bg-input' : 'cursor-default!',
  )

  const content = (
    <>
      {meta.icon}
      <span className="flex-1">
        <span
          className={cn(
            'block truncate text-sm tracking-tight',
            isUnread ? 'text-foreground font-semibold' : 'text-foreground font-medium',
          )}
        >
          {meta.title}
        </span>
        <span className="text-muted-foreground block truncate text-sm">{meta.description}</span>
      </span>
      <time
        className="text-muted-foreground shrink-0 text-xs whitespace-nowrap tabular-nums"
        dateTime={notification.createdAt}
      >
        {formatRelativeTime(notification.createdAt)}
      </time>
      {isUnread && (
        <span className="relative flex size-2 shrink-0">
          <span className="bg-primary size-2 rounded-full" aria-hidden />
          <span className="bg-primary absolute inset-0 animate-ping rounded-full" aria-hidden />
        </span>
      )}
    </>
  )

  if (meta.target) {
    return (
      <Link
        to={meta.target.to}
        params={meta.target.params}
        className={rowClassName}
        onClick={handleClick}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      className={rowClassName}
      onClick={handleClick}
      title={isUnread ? 'Mark as read' : undefined}
    >
      {content}
    </button>
  )
}
