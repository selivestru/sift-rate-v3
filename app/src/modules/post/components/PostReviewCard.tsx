import { Link } from '@tanstack/react-router'

import { MEDIA_TYPES, mediaDetailRouteByType, mediaTypeMeta } from '~/common/constants/media-type'
import { MediaTypeBadge } from '~/common/ui/MediaTypeBadge'
import { RatingBadge } from '~/common/ui/RatingBadge'
import { cn } from '~/common/utils/cn'
import type { Review } from '~/modules/review'

import { PostContent } from './PostContent'

interface PostReviewCardProps {
  review: Review
  isDetailView: boolean
}

export const PostReviewCard = ({ review, isDetailView }: PostReviewCardProps) => {
  const { media } = review
  const typeMeta = mediaTypeMeta[media.mediaType]
  const TypeIcon = typeMeta.icon
  const isMusic = media.mediaType === MEDIA_TYPES.ALBUM || media.mediaType === MEDIA_TYPES.TRACK
  const detailTo = mediaDetailRouteByType[media.mediaType]

  return (
    <div
      className={cn(
        'bg-card border-border overflow-hidden rounded-xl border',
        !isDetailView && 'mb-2',
      )}
    >
      <div className="flex gap-3 p-3">
        <Link
          to={detailTo}
          params={{ externalId: media.externalId }}
          aria-label={`Open ${media.title}`}
          className={cn(
            'bg-muted border-border relative z-10 shrink-0 overflow-hidden rounded-lg border outline-none',
            'focus-visible:ring-ring/40 focus-visible:ring-2',
            isMusic ? 'aspect-square w-20 sm:w-24' : 'aspect-2/3 w-20 sm:w-24',
          )}
        >
          {media.posterUrl ? (
            <img
              src={media.posterUrl}
              alt={media.title}
              className="size-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <TypeIcon className="size-6" style={{ color: typeMeta.color }} aria-hidden />
            </div>
          )}
        </Link>

        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <MediaTypeBadge mediaType={media.mediaType} />
            <RatingBadge rating={review.rating} />
          </div>

          <Link
            to={detailTo}
            params={{ externalId: media.externalId }}
            className={cn(
              'text-foreground hover:text-primary focus-visible:text-primary relative z-10 line-clamp-2 w-fit text-base font-semibold tracking-tight outline-none transition-colors duration-200',
              'sm:text-xl',
            )}
          >
            {media.title}
          </Link>
        </div>
      </div>

      {review.content && <PostContent isReview content={review.content} />}
    </div>
  )
}
