import { Link } from '@tanstack/react-router'

import { MEDIA_TYPES, mediaDetailRouteByType } from '~/common/constants/media-type'
import { MediaTypeBadge } from '~/common/ui/MediaTypeBadge'
import { RatingBadge } from '~/common/ui/RatingBadge'
import { cn } from '~/common/utils/cn'
import type { ReviewMediaCard } from '~/modules/review'

interface FeedMediaBlockProps {
  media: ReviewMediaCard
  rating?: number
}

export const FeedMediaBlock = ({ media, rating }: FeedMediaBlockProps) => {
  const detailTo = mediaDetailRouteByType[media.mediaType]
  const isMusic = media.mediaType === MEDIA_TYPES.ALBUM || media.mediaType === MEDIA_TYPES.TRACK

  return (
    <Link
      to={detailTo}
      params={{ externalId: media.externalId }}
      className={cn(
        'bg-muted group/media flex items-center gap-3 rounded-xl border border-border p-3',
        'outline-none transition-colors duration-300 hover:bg-input focus-visible:ring-2 focus-visible:ring-ring/40',
      )}
      aria-label={`Open ${media.title}`}
    >
      <div
        className={cn(
          'bg-background border-border relative w-18 shrink-0 overflow-hidden rounded-lg border sm:w-20',
          isMusic ? 'aspect-square' : 'aspect-2/3',
        )}
      >
        {media.posterUrl ? (
          <img
            src={media.posterUrl}
            alt=""
            className="size-full object-cover transition-transform duration-300 group-hover/media:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="text-muted-foreground flex size-full items-center justify-center px-1 text-center text-xs">
            No cover
          </div>
        )}
      </div>

      <div className="flex-1 space-y-1">
        <p className="group-hover/media:text-primary truncate text-base font-semibold tracking-tight">
          {media.title}
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          <MediaTypeBadge mediaType={media.mediaType} size="md" />
          {rating != null && <RatingBadge rating={rating} size="sm" variant="rating" />}
        </div>
      </div>
    </Link>
  )
}
