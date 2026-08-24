import { Link } from '@tanstack/react-router'
import { useState } from 'react'

import { Button } from '~/common/ui/Button'
import { RatingBadge } from '~/common/ui/RatingBadge'
import { cn } from '~/common/utils/cn'
import { formatRelativeTime } from '~/common/utils/formatRelativeTime'

import { useNotificationReadObserver } from '../hooks/useNotificationReadObserver'
import type { Notification } from '../schema/notification.schema'
import { getNotificationMeta, type NotificationQuote } from '../utils/getNotificationMeta'

interface NotificationItemProps {
  notification: Notification
}

interface QuotedContentProps {
  quote: NotificationQuote
  variant?: 'primary' | 'context'
}

const QuotedContent = ({ quote, variant = 'primary' }: QuotedContentProps) => {
  const [expanded, setExpanded] = useState(false)

  const { review } = quote
  const text = review ? review.content : quote.content

  if (!text) {
    if (review) {
      return (
        <span
          className={cn(
            'mt-2 flex items-center gap-2 rounded-r-md border-l-2 py-1.5 pr-2 pl-3',
            variant === 'primary' ? 'border-border bg-muted/70' : 'border-border/50 bg-muted/40',
          )}
        >
          <span
            className={cn(
              'truncate',
              variant === 'primary'
                ? 'text-foreground/80 text-sm'
                : 'text-muted-foreground text-sm',
            )}
          >
            {review.mediaTitle}
          </span>
          <RatingBadge rating={review.rating} size="sm" className="shrink-0" />
        </span>
      )
    }

    return (
      <span className="text-muted-foreground border-border/60 mt-2 block border-l-2 pl-3 text-sm italic">
        {quote.unavailableLabel}
      </span>
    )
  }

  const maxLength = variant === 'context' ? 120 : 200
  const isLong = text.length > maxLength
  const visible = expanded || !isLong ? text : `${text.slice(0, maxLength)}…`

  return (
    <span
      className={cn(
        'mt-2 block rounded-r-md border-l-2 py-1.5 pr-2 pl-3',
        variant === 'primary' ? 'border-border bg-muted/70' : 'border-border/50 bg-muted/40',
      )}
    >
      {review && (
        <span className="mb-1 flex items-center gap-2">
          <span className="text-muted-foreground flex-1 truncate text-sm font-medium">
            {review.mediaTitle}
          </span>
          <RatingBadge rating={review.rating} size="xs" className="shrink-0" />
        </span>
      )}
      <span
        className={cn(
          'block leading-relaxed wrap-break-word whitespace-pre-wrap',
          variant === 'primary' ? 'text-foreground/80 text-sm' : 'text-muted-foreground text-sm',
        )}
      >
        {visible}
      </span>
      {isLong && !expanded && (
        <Button
          variant="ghost"
          size="xs"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setExpanded(true)
          }}
          className="text-muted-foreground hover:text-primary relative z-10 -ml-2 h-auto px-2 py-0.5"
        >
          Show more
        </Button>
      )}
    </span>
  )
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const meta = getNotificationMeta(notification)
  const isUnread = notification.readAt === null

  const readObserverRef = useNotificationReadObserver(notification.id, isUnread)

  const rowClassName = cn(
    'flex w-full items-start gap-3 px-4 py-4 text-left transition-colors duration-200 focus-visible:ring-ring/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset',
    isUnread && 'bg-muted',
    meta.target ? 'cursor-pointer hover:bg-input/20' : 'cursor-default!',
  )

  const content = (
    <>
      <span className="pt-0.5">{meta.icon}</span>
      <span className="flex-1">
        <span className="flex items-start justify-between gap-3">
          <span>
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
          <span className="flex shrink-0 items-center gap-2 pt-0.5">
            <time
              className="text-muted-foreground text-xs whitespace-nowrap tabular-nums"
              dateTime={notification.createdAt}
            >
              {formatRelativeTime(notification.createdAt)}
            </time>
            {isUnread && (
              <span className="relative flex size-2 shrink-0">
                <span className="bg-primary size-2 rounded-full" aria-hidden />
                <span
                  className="bg-primary absolute inset-0 animate-ping rounded-full"
                  aria-hidden
                />
              </span>
            )}
          </span>
        </span>
        {meta.context && <QuotedContent quote={meta.context} variant="context" />}
        {meta.quote && <QuotedContent quote={meta.quote} />}
      </span>
    </>
  )

  if (meta.target) {
    return (
      <Link
        to={meta.target.to}
        params={meta.target.params}
        className={rowClassName}
        ref={readObserverRef}
      >
        {content}
      </Link>
    )
  }

  return (
    <div className={rowClassName} ref={readObserverRef}>
      {content}
    </div>
  )
}
