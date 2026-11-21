import { Link } from '@tanstack/react-router'
import { useIntlayer } from 'react-intlayer'
import { Calendar, CrownStar, Pen, Star, Trash6 } from 'reicon-react'

import { MEDIA_TYPES, mediaDetailRouteByType, mediaTypeMeta } from '~/common/constants/media-type'
import { useAppLocale } from '~/common/i18n'
import { Badge } from '~/common/ui/Badge'
import { Button } from '~/common/ui/Button'
import { MediaTypeBadge } from '~/common/ui/MediaTypeBadge'
import { RatingBadge } from '~/common/ui/RatingBadge'
import { cn } from '~/common/utils/cn'
import { formatDate } from '~/common/utils/formatDate'

import type { Review } from '../types/review.types'
import { DeleteReviewDialog } from './DeleteReviewDialog'
import { PerfectStardust } from './PerfectStardust'
import { UpsertReviewDialog } from './UpsertReviewDialog'

interface ReviewCardProps {
  review: Review
  seasonReviews?: Review[]
}

export const ReviewCard = ({ review, seasonReviews }: ReviewCardProps) => {
  const { locale } = useAppLocale()
  const content = useIntlayer('review-card')
  const shared = useIntlayer('shared')
  const { media } = review
  const typeMeta = mediaTypeMeta[media.mediaType]
  const accent = typeMeta.color
  const TypeIcon = typeMeta.icon
  const isMusic = media.mediaType === MEDIA_TYPES.ALBUM || media.mediaType === MEDIA_TYPES.TRACK
  const detailTo = mediaDetailRouteByType[media.mediaType]
  const hasContent = Boolean(review.content?.trim())
  const isPerfect = review.rating === 10
  const isShowGroupHeader = review.seasonNumber != null

  return (
    <article
      style={{
        '--card-accent': isPerfect && !isShowGroupHeader ? 'var(--rating)' : accent,
      }}
      className={cn(
        'bg-card group hover:border-(--card-accent)/40 border-(--card-accent)/20 relative flex flex-col gap-3 overflow-hidden rounded-xl border p-3 transition-colors duration-300',
        'sm:flex-row sm:items-stretch sm:gap-4 sm:p-4',
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-50 transition-opacity duration-300 group-hover:opacity-0"
        style={{
          backgroundImage:
            'linear-gradient(to left, color-mix(in oklab, var(--card-accent) 12%, transparent), transparent 52%)',
        }}
      />
      {isPerfect && <PerfectStardust />}

      {!isShowGroupHeader && (
        <div className="absolute top-3 right-3 z-10 flex gap-1 opacity-0 sm:opacity-100">
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
                aria-label={content.editReviewFor({ title: media.title })}
              >
                <Pen weight="Filled" />
              </Button>
            )}
          </UpsertReviewDialog>

          <DeleteReviewDialog
            reviewId={review.id}
            rating={review.rating}
            mediaType={media.mediaType}
          >
            {({ open }) => (
              <Button
                isIconOnly
                type="button"
                variant="destructive-soft"
                onClick={open}
                aria-label={content.deleteReviewFor({ title: media.title })}
              >
                <Trash6 weight="Filled" />
              </Button>
            )}
          </DeleteReviewDialog>
        </div>
      )}

      <Link
        to={detailTo}
        params={{ externalId: media.externalId }}
        aria-label={content.openTitle({ title: media.title })}
        className={cn(
          'bg-muted group/poster relative z-px w-full shrink-0 overflow-hidden rounded-lg border border-border outline-none h-fit',
          'focus-visible:ring-2 focus-visible:ring-(--card-accent)/40',
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
              className="z-px relative size-full object-contain transition-transform duration-300 group-hover:scale-[1.02] sm:object-cover"
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

      <div className="z-px relative flex flex-1 flex-col gap-2 sm:gap-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <MediaTypeBadge mediaType={media.mediaType} />

          {isPerfect && !isShowGroupHeader && (
            <Badge variant="rating" startIcon={<CrownStar />}>
              {content.perfect.value}
            </Badge>
          )}
        </div>

        <Link
          to={detailTo}
          params={{ externalId: media.externalId }}
          className={cn(
            'text-foreground line-clamp-2 w-fit text-lg font-semibold tracking-tight outline-none transition-colors duration-200',
            'sm:text-xl',
            'hover:text-primary focus-visible:text-primary focus-visible:underline',
          )}
        >
          {media.title}
        </Link>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {isShowGroupHeader ? (
            <UpsertReviewDialog
              media={{
                mediaType: media.mediaType,
                externalId: media.externalId,
              }}
            >
              {({ open }) => (
                <Button
                  type="button"
                  variant="secondary"
                  className="text-rating"
                  startIcon={<Star weight="Filled" className="text-rating" aria-hidden />}
                  onClick={open}
                >
                  {content.rateShow.value}
                </Button>
              )}
            </UpsertReviewDialog>
          ) : (
            <RatingBadge
              size="md"
              rating={review.rating}
              variant={isPerfect ? 'rating' : 'default'}
            />
          )}
          <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
            <Calendar className="size-3.5 shrink-0" aria-hidden />
            <time dateTime={review.createdAt}>{formatDate(review.createdAt, locale)}</time>
          </span>
        </div>

        <blockquote
          className={cn(
            'bg-muted rounded-r-lg border-l-2 border-border py-2.5 pr-3 pl-3.5',
            'text-sm leading-relaxed',
            isPerfect && hasContent && 'border-l-rating',
          )}
        >
          {hasContent ? (
            <p className="text-foreground leading-relaxed hyphens-auto whitespace-pre-wrap italic">
              {review.content}
            </p>
          ) : (
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap italic">
              {content.noWrittenReview.value}
            </p>
          )}
        </blockquote>

        {seasonReviews && seasonReviews.length > 0 && (
          <div className="bg-muted/60 border-border rounded-lg border p-2">
            <p className="text-muted-foreground mb-1 px-1 text-xs font-semibold tracking-wide uppercase">
              {content.seasons.value}
            </p>
            <div className="divide-border divide-y">
              {seasonReviews.map((seasonReview) => {
                const seasonText = seasonReview.content?.trim()
                const seasonHasText = Boolean(seasonText)

                return (
                  <UpsertReviewDialog
                    key={seasonReview.id}
                    media={{
                      mediaType: media.mediaType,
                      externalId: media.externalId,
                    }}
                    initialData={seasonReview}
                    lockedSeasonNumber={seasonReview.seasonNumber ?? undefined}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={open}
                        className={cn(
                          'hover:bg-accent focus-visible:ring-ring/40 flex w-full cursor-pointer flex-col gap-1 px-1.5 py-2 text-left outline-none transition-colors duration-200 focus-visible:ring-2',
                        )}
                        aria-label={content.editReviewFor({ title: media.title })}
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-foreground text-sm font-semibold tabular-nums">
                            {content.seasonChip({ season: seasonReview.seasonNumber ?? 0 })}
                          </span>
                          <RatingBadge
                            rating={seasonReview.rating}
                            variant={seasonReview.rating === 10 ? 'rating' : 'default'}
                          />
                        </span>
                        {seasonHasText && (
                          <span className="text-foreground line-clamp-3 border-l-2 border-(--card-accent)/40 py-0.5 pl-2.5 text-sm leading-relaxed italic">
                            {seasonText}
                          </span>
                        )}
                      </button>
                    )}
                  </UpsertReviewDialog>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {!isShowGroupHeader && (
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
                startIcon={<Pen weight="Filled" />}
                onClick={open}
                aria-label={content.editReviewFor({ title: media.title })}
              >
                {shared.edit.value}
              </Button>
            )}
          </UpsertReviewDialog>

          <DeleteReviewDialog
            reviewId={review.id}
            rating={review.rating}
            mediaType={media.mediaType}
          >
            {({ open }) => (
              <Button
                type="button"
                variant="destructive-soft"
                startIcon={<Trash6 weight="Filled" />}
                onClick={open}
                aria-label={content.deleteReviewFor({ title: media.title })}
              >
                {shared.delete.value}
              </Button>
            )}
          </DeleteReviewDialog>
        </div>
      )}
    </article>
  )
}
