import { Link } from '@tanstack/react-router'
import { StarIcon, TrashIcon, UsersIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '~/common/ui/Avatar'
import { Badge } from '~/common/ui/Badge'
import { Button } from '~/common/ui/Button'
import { cn } from '~/common/utils/cn'
import { formatRelativeTime } from '~/common/utils/formatRelativeTime'
import { getFirstLetter } from '~/common/utils/getFirstLetter'
import { useAuthStore } from '~/modules/auth'
import { DialogReviewDialog, REVIEW_VISIBILITY } from '~/modules/review'

import type { MediaReviewItem } from '../types/media-state.types'

interface MediaReviewCardProps {
  review: MediaReviewItem
}

export const MediaReviewCard = ({ review }: MediaReviewCardProps) => {
  const currentUserId = useAuthStore((state) => state.user?.id)

  const isPerfect = review.rating === 10
  const { user } = review

  return (
    <article
      className={cn(
        'bg-card text-card-foreground border-border flex gap-3 rounded-xl border p-4',
        isPerfect &&
          'border-rating/25 ring-rating/20 from-rating/5 bg-linear-to-r to-transparent ring-1',
      )}
    >
      <Avatar size="lg">
        <AvatarImage src={user.avatarUrl!} alt={user.username!} />
        <AvatarFallback>{getFirstLetter(user.username!)}</AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <header className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-0.5">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <Link
                to="/$username"
                params={{ username: user.username! }}
                className="text-foreground truncate text-sm font-semibold hover:underline"
              >
                {user.username}
              </Link>

              {review.visibility === REVIEW_VISIBILITY.FRIENDS && (
                <Badge
                  variant="outline"
                  className="text-muted-foreground h-5 gap-1 px-1.5 text-[11px] font-normal"
                >
                  <UsersIcon className="size-3" />
                  Friends
                </Badge>
              )}
            </div>

            <time dateTime={review.createdAt} className="text-muted-foreground text-xs">
              {formatRelativeTime(review.createdAt)}
            </time>
          </div>

          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                'flex items-center gap-1 rounded-full border px-2 py-0.5',
                isPerfect
                  ? 'border-rating/50 bg-rating/20 shadow-rating/20 shadow-sm'
                  : 'border-rating/30 bg-rating/10',
              )}
              aria-label={
                isPerfect ? 'Perfect score 10 out of 10' : `Rated ${review.rating} out of 10`
              }
            >
              <StarIcon className="fill-rating text-rating size-3.5" />
              <span className="text-rating text-sm font-semibold tabular-nums">
                {review.rating}
              </span>
            </div>

            {currentUserId === user.id && (
              <DialogReviewDialog reviewId={review.id}>
                {({ open }) => (
                  <Button
                    isIconOnly
                    variant="danger-soft"
                    onClick={open}
                    aria-label="Delete review"
                  >
                    <TrashIcon />
                  </Button>
                )}
              </DialogReviewDialog>
            )}
          </div>
        </header>

        {review.content && <p className="text-sm leading-relaxed break-all">{review.content}</p>}
      </div>
    </article>
  )
}
