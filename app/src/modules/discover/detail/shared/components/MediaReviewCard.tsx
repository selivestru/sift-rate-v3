import { Link } from '@tanstack/react-router'
import { useIntlayer } from 'react-intlayer'
import { Star } from 'reicon-react'

import { useAppLocale } from '~/common/i18n'
import { Avatar, AvatarFallback, AvatarImage } from '~/common/ui/Avatar'
import { cn } from '~/common/utils/cn'
import { formatRelativeTime } from '~/common/utils/formatRelativeTime'
import { getFirstLetter } from '~/common/utils/getFirstLetter'

import type { MediaReviewItem } from '../types/media-state.types'

interface MediaReviewCardProps {
  review: MediaReviewItem
}

export const MediaReviewCard = ({ review }: MediaReviewCardProps) => {
  const { locale } = useAppLocale()
  const content = useIntlayer('discover-detail')
  const { user } = review

  return (
    <article className="bg-card text-card-foreground border-border relative flex gap-3 rounded-xl border p-4">
      <Avatar size="lg">
        <AvatarImage src={user.avatarUrl ?? undefined} alt={user.username ?? undefined} />
        <AvatarFallback>{getFirstLetter(user.username)}</AvatarFallback>
      </Avatar>

      <div className="flex flex-1 flex-col gap-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              {user.username ? (
                <Link
                  to="/$username"
                  params={{ username: user.username }}
                  className="text-foreground truncate text-sm font-semibold hover:underline"
                >
                  @{user.username}
                </Link>
              ) : (
                <span className="text-foreground truncate text-sm font-semibold">
                  {content.unknown.value}
                </span>
              )}

              <time dateTime={review.createdAt} className="text-muted-foreground text-xs">
                {formatRelativeTime(review.createdAt, locale)}
              </time>
            </div>

            <div
              className="flex items-center gap-0.5"
              aria-label={content.rated({ rating: review.rating })}
            >
              {Array.from({ length: 10 }, (_, index) => {
                const filled = index < review.rating

                return (
                  <Star
                    key={index}
                    weight={filled ? 'Filled' : 'Outline'}
                    className={cn('size-5', filled ? 'text-rating' : 'text-muted-foreground')}
                    aria-hidden
                  />
                )
              })}
            </div>
          </div>
        </div>

        {review.content && (
          <p className="text-foreground text-sm leading-relaxed break-all whitespace-pre-wrap">
            {review.content}
          </p>
        )}
      </div>
    </article>
  )
}
