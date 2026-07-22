import { Link } from '@tanstack/react-router'
import { Calendar, CrownStar, Pen, Trash2, TriangleWarning } from 'reicon-react'

import { MEDIA_TYPES, mediaDetailRouteByType, mediaTypeMeta } from '~/common/constants/media-type'
import { Badge } from '~/common/ui/Badge'
import { Button } from '~/common/ui/Button'
import { MediaTypeBadge } from '~/common/ui/MediaTypeBadge'
import { RatingBadge } from '~/common/ui/RatingBadge'
import { cn } from '~/common/utils/cn'
import { formatDate } from '~/common/utils/formatDate'

import { reviewVisibilityConfig } from '../constants/visibility'
import type { Review } from '../types/review.types'
import { DialogReviewDialog } from './DeleteReviewDialog'
import { PerfectStardust } from './PerfectStardust'
import { UpsertReviewDialog } from './UpsertReviewDialog'

interface ReviewCardProps {
  review: Review
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const { media } = review
  const typeMeta = mediaTypeMeta[media.mediaType]
  const TypeIcon = typeMeta.icon
  const visibility = reviewVisibilityConfig[review.visibility]
  const VisibilityIcon = visibility.icon
  const isMusic = media.mediaType === MEDIA_TYPES.ALBUM || media.mediaType === MEDIA_TYPES.TRACK
  const detailTo = mediaDetailRouteByType[media.mediaType]
  const hasContent = Boolean(review.content?.trim())
  const isPerfect = review.rating === 10
  const accent = isPerfect ? 'var(--rating)' : typeMeta.color

  return (
    <article
      className={cn(
        'bg-card group/card relative flex flex-col gap-3 overflow-hidden rounded-2xl p-3 transition-all duration-300',
        'sm:flex-row sm:items-stretch sm:gap-4 sm:p-3.5',
        'ring-1 ring-(--card-accent)/20 hover:ring-2 hover:ring-(--card-accent)/50',
        'hover:-translate-y-px',
      )}
      style={{
        '--card-accent': accent,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-90 transition-opacity duration-300 group-hover/card:opacity-100"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 105% 95% at 0% 0%, color-mix(in oklab, var(--card-accent) 22%, transparent), transparent 70%), radial-gradient(ellipse 75% 65% at 100% 100%, color-mix(in oklab, var(--card-accent) 13%, transparent), transparent 66%)',
        }}
      />
      <div
        className={cn(
          'pointer-events-none absolute inset-0 opacity-0 transition-all duration-500 ease-out',
          'group-hover/card:opacity-100 group-hover/card:scale-105',
        )}
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 115% 100% at 8% 12%, color-mix(in oklab, var(--card-accent) 32%, transparent), transparent 62%), radial-gradient(ellipse 85% 75% at 92% 88%, color-mix(in oklab, var(--card-accent) 18%, transparent), transparent 60%)',
        }}
      />

      {isPerfect && <PerfectStardust />}

      <div className="absolute top-2.5 right-2.5 z-10 flex gap-1 opacity-0 sm:opacity-100">
        <UpsertReviewDialog
          media={{
            mediaType: media.mediaType,
            externalId: media.externalId,
          }}
          initialData={review}
        >
          {({ open }) => (
            <Button
              isIconOnly
              type="button"
              variant="secondary"
              onClick={open}
              aria-label={`Edit review for ${media.title}`}
            >
              <Pen />
            </Button>
          )}
        </UpsertReviewDialog>

        <DialogReviewDialog reviewId={review.id}>
          {({ open }) => (
            <Button
              isIconOnly
              type="button"
              variant="danger-soft"
              onClick={open}
              aria-label={`Delete review for ${media.title}`}
            >
              <Trash2 />
            </Button>
          )}
        </DialogReviewDialog>
      </div>

      <Link
        to={detailTo}
        params={{ externalId: media.externalId }}
        aria-label={`Open ${media.title}`}
        className={cn(
          'bg-muted group/poster relative z-px w-full shrink-0 overflow-hidden rounded-xl shadow-sm outline-none',
          'ring-1 ring-foreground/6 transition-shadow duration-300',
          'hover:ring-2 hover:ring-(--card-accent)/70',
          'focus-visible:ring-2 focus-visible:ring-primary',
          isMusic
            ? 'aspect-square max-h-56 sm:max-h-none sm:size-36 md:size-42'
            : 'aspect-2/3 max-h-64 sm:max-h-none sm:w-36 md:w-42',
        )}
      >
        {media.posterUrl ? (
          <>
            <img
              src={media.posterUrl}
              alt=""
              aria-hidden
              className="absolute inset-0 size-full scale-110 object-cover blur-xl sm:hidden"
              loading="lazy"
            />
            <img
              src={media.posterUrl}
              alt={media.title}
              className="z-px relative size-full object-contain transition-transform duration-500 ease-out group-hover/poster:scale-[1.03] sm:object-cover"
              loading="lazy"
            />
          </>
        ) : (
          <div className="flex size-full items-center justify-center">
            <TypeIcon
              className="size-10 sm:size-12"
              aria-hidden
              style={{ color: typeMeta.color }}
            />
          </div>
        )}
      </Link>

      <div className="z-px relative flex min-w-0 flex-1 flex-col gap-2 sm:gap-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <MediaTypeBadge mediaType={media.mediaType} />

          {isPerfect && (
            <Badge variant="rating" startIcon={<CrownStar />} className="bg-rating/10">
              Perfect
            </Badge>
          )}

          <Badge color={visibility.color} startIcon={<VisibilityIcon />}>
            {visibility.label}
          </Badge>

          {review.hasSpoiler && (
            <Badge variant="danger" startIcon={<TriangleWarning />}>
              Spoilers
            </Badge>
          )}
        </div>

        <Link
          to={detailTo}
          params={{ externalId: media.externalId }}
          className={cn(
            'text-foreground line-clamp-2 w-fit text-lg font-bold tracking-tight outline-none transition-colors duration-300',
            'sm:text-xl',
            'hover:text-primary focus-visible:text-primary focus-visible:underline',
          )}
        >
          {media.title}
        </Link>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <RatingBadge
            size="md"
            rating={review.rating}
            variant={isPerfect ? 'default' : 'outline'}
          />
          <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
            <Calendar className="size-3.5 shrink-0 opacity-80" aria-hidden />
            <time dateTime={review.createdAt}>{formatDate(review.createdAt)}</time>
          </span>
        </div>

        <blockquote
          className={cn(
            'bg-foreground/3 rounded-r-xl border-l-2 py-2.5 pr-3 pl-3.5',
            'text-sm leading-relaxed',
            !hasContent && 'border-border/80',
          )}
          style={
            hasContent
              ? {
                  borderLeftColor: 'var(--card-accent)',
                }
              : undefined
          }
        >
          {hasContent ? (
            <p className="text-foreground/90 break-all italic">{review.content}</p>
          ) : (
            <p className="text-muted-foreground italic">No written review</p>
          )}
        </blockquote>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:hidden">
        <UpsertReviewDialog
          media={{
            mediaType: media.mediaType,
            externalId: media.externalId,
          }}
          initialData={review}
        >
          {({ open }) => (
            <Button
              type="button"
              variant="secondary"
              startIcon={<Pen />}
              onClick={open}
              aria-label={`Edit review for ${media.title}`}
            >
              Edit
            </Button>
          )}
        </UpsertReviewDialog>

        <DialogReviewDialog reviewId={review.id}>
          {({ open }) => (
            <Button
              type="button"
              variant="danger-soft"
              startIcon={<Trash2 />}
              onClick={open}
              aria-label={`Delete review for ${media.title}`}
            >
              Delete
            </Button>
          )}
        </DialogReviewDialog>
      </div>
    </article>
  )
}
