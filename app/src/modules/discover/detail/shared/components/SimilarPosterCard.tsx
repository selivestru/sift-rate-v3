import { Link } from '@tanstack/react-router'

import { MEDIA_TYPES, mediaTypeMeta, mediaTypeToSlug } from '~/common/constants/media-type'
import { RatingBadge } from '~/common/ui/RatingBadge'
import { cn } from '~/common/utils/cn'

import type { MediaSimilarItem, SimilarMediaType } from '../types/media-detail.types'

interface SimilarPosterCardProps {
  item: MediaSimilarItem
  mediaType?: SimilarMediaType
  className?: string
}

const routeFor = (mediaType: SimilarMediaType) => {
  const slug = mediaTypeToSlug[mediaType]
  return `/discover/${slug}/$externalId` as const
}

export const SimilarPosterCard = ({
  item,
  mediaType = MEDIA_TYPES.MOVIE,
  className,
}: SimilarPosterCardProps) => {
  const NotFoundIcon = mediaTypeMeta[mediaType].icon

  return (
    <Link
      to={routeFor(mediaType)}
      params={{ externalId: item.id }}
      className={cn(
        'group flex h-full w-full flex-col gap-2 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99]',
        className,
      )}
    >
      <div className="bg-muted ring-border relative aspect-2/3 w-full overflow-hidden rounded-xl ring-1">
        {item.posterUrl ? (
          <img
            src={item.posterUrl}
            alt={item.title}
            className="size-full object-cover"
            loading="lazy"
            width={342}
            height={513}
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <NotFoundIcon className="text-muted-foreground size-8 opacity-60" aria-hidden />
          </div>
        )}
        {item.rating > 0 && (
          <RatingBadge rating={item.rating} className="absolute top-1.5 right-1.5" />
        )}
      </div>
      <div className="px-0.5">
        <p className="text-foreground line-clamp-2 h-[2.40625rem] text-sm leading-snug font-medium">
          {item.title}
        </p>
        <p className="text-muted-foreground h-[1.03125rem] text-xs tabular-nums">{item.year}</p>
      </div>
    </Link>
  )
}
