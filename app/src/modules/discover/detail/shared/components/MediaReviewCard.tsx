import { Link } from '@tanstack/react-router'
import { Pen, Star, Trash6 } from 'reicon-react'

import type { MediaType } from '~/common/constants/media-type'
import { Avatar, AvatarFallback, AvatarImage } from '~/common/ui/Avatar'
import { Badge } from '~/common/ui/Badge'
import { Button } from '~/common/ui/Button'
import { cn } from '~/common/utils/cn'
import { formatRelativeTime } from '~/common/utils/formatRelativeTime'
import { getFirstLetter } from '~/common/utils/getFirstLetter'
import { useAuthStore } from '~/modules/auth'
import { DeleteReviewDialog, UpsertReviewDialog } from '~/modules/review'

import type { MediaReviewItem } from '../types/media-state.types'

interface MediaReviewCardProps {
  review: MediaReviewItem
  externalId: string
  mediaType: MediaType
}

export const MediaReviewCard = ({ review, externalId, mediaType }: MediaReviewCardProps) => {
  const { user } = review

  const currentUserId = useAuthStore((state) => state.user?.id)
  const isOwner = currentUserId === user.id

  const isPerfect = review.rating === 10

  return (
    <article
      className={cn(
        'bg-card text-card-foreground border-border flex gap-3 rounded-xl border p-4',
        isPerfect && 'border-rating',
      )}
    >
      <Avatar size="lg">
        <AvatarImage src={user.avatarUrl!} alt={user.username!} />
        <AvatarFallback>{getFirstLetter(user.username!)}</AvatarFallback>
      </Avatar>

      <div className="flex flex-1 flex-col gap-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/$username"
                params={{ username: user.username! }}
                className="text-foreground truncate text-sm font-semibold hover:underline"
              >
                {user.username}
              </Link>

              {isPerfect && (
                <Badge variant="rating" size="sm">
                  Perfect
                </Badge>
              )}
            </div>

            <div
              className="flex items-center gap-0.5"
              aria-label={
                isPerfect ? 'Perfect score 10 out of 10' : `Rated ${review.rating} out of 10`
              }
            >
              {Array.from({ length: 10 }, (_, index) => {
                const filled = index < review.rating

                return (
                  <Star
                    key={index}
                    weight={filled ? 'Filled' : 'Outline'}
                    className={cn('size-5', filled ? 'text-rating' : 'text-muted-foreground/40')}
                    aria-hidden
                  />
                )
              })}
            </div>

            <time dateTime={review.createdAt} className="text-muted-foreground text-xs">
              {formatRelativeTime(review.createdAt)}
            </time>
          </div>

          {isOwner && (
            <div className="flex gap-2">
              <UpsertReviewDialog
                initialData={review}
                media={{
                  mediaType,
                  externalId,
                }}
              >
                {({ open }) => (
                  <Button isIconOnly variant="secondary" onClick={open} aria-label="Edit review">
                    <Pen weight="Filled" />
                  </Button>
                )}
              </UpsertReviewDialog>
              <DeleteReviewDialog reviewId={review.id} rating={review.rating} mediaType={mediaType}>
                {({ open }) => (
                  <Button
                    isIconOnly
                    variant="destructive-soft"
                    onClick={open}
                    aria-label="Delete review"
                  >
                    <Trash6 weight="Filled" />
                  </Button>
                )}
              </DeleteReviewDialog>
            </div>
          )}
        </div>

        {review.content && (
          <p className="text-foreground text-sm leading-relaxed break-all">{review.content}</p>
        )}
      </div>
    </article>
  )
}
