import { Link } from '@tanstack/react-router'
import { BookOpenIcon, FilmIcon, Gamepad2Icon, TvIcon } from 'lucide-react'

import { MEDIA_TYPES, mediaTypeToSlug } from '~/common/constants/media-type'
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

const iconFor = (mediaType: SimilarMediaType) => {
  if (mediaType === MEDIA_TYPES.TV_SHOW) return TvIcon
  if (mediaType === MEDIA_TYPES.GAME) return Gamepad2Icon
  if (mediaType === MEDIA_TYPES.BOOK) return BookOpenIcon
  return FilmIcon
}

export const SimilarPosterCard = ({
  item,
  mediaType = MEDIA_TYPES.MOVIE,
  className,
}: SimilarPosterCardProps) => {
  const NotFoundIcon = iconFor(mediaType)

  return (
    <Link
      to={routeFor(mediaType)}
      params={{ externalId: item.id }}
      className={cn(
        'group flex w-full flex-col gap-2 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99]',
        className,
      )}
    >
      <div className="bg-muted ring-foreground/8 relative aspect-2/3 w-full overflow-hidden rounded-xl ring-1">
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
      <div className="min-w-0 px-0.5">
        <p className="text-foreground line-clamp-2 text-sm leading-snug font-medium">
          {item.title}
        </p>
        {item.year && <p className="text-muted-foreground text-xs tabular-nums">{item.year}</p>}
      </div>
    </Link>
  )
}
