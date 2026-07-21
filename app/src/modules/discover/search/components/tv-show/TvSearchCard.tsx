import { Link } from '@tanstack/react-router'
import { ArrowRightIcon, StarIcon } from 'lucide-react'

import { MEDIA_TYPES, mediaTypeMeta } from '~/common/constants/media-type'
import { Badge } from '~/common/ui/Badge'
import { Button } from '~/common/ui/Button'
import { MediaTypeBadge } from '~/common/ui/MediaTypeBadge'
import { cn } from '~/common/utils/cn'

import type { TvSearchItem } from '../../types/discover-search.types'

interface TvSearchCardProps {
  item: TvSearchItem
}

export const TvSearchCard = ({ item }: TvSearchCardProps) => {
  const { color, icon: MediaTypeIcon } = mediaTypeMeta[MEDIA_TYPES.TV_SHOW]

  return (
    <Link
      to="/discover/tv_show/$externalId"
      params={{ externalId: item.id }}
      className={cn(
        'bg-card group relative flex gap-4 overflow-hidden rounded-2xl transition-all duration-500 ease-out hover:scale-[1.01] hover:shadow-lg active:scale-[0.99]',
        'ring-1 ring-border hover:ring-(--card-accent)',
      )}
      style={{
        '--card-accent': color,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-10 transition-opacity duration-500 group-hover:opacity-20"
        style={{
          background: `linear-gradient(to left, ${color}, transparent 60%)`,
        }}
      />

      <div
        className={cn(
          'relative aspect-2/3 w-27.5 shrink-0 overflow-hidden sm:w-37.5 border-r border-r-transparent',
          item.posterUrl ? 'border-r-transparent' : 'border-r-border',
        )}
      >
        {item.posterUrl ? (
          <>
            <img
              src={item.posterUrl}
              alt={item.title}
              className="size-full object-cover"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-100 transition-opacity duration-500 group-hover:opacity-0" />
          </>
        ) : (
          <div className="flex size-full items-center justify-center">
            <MediaTypeIcon className="size-10 text-(--card-accent)" />
          </div>
        )}
      </div>

      <div className="relative flex min-w-0 flex-1 flex-col justify-center gap-2 py-4 pr-4">
        <MediaTypeBadge mediaType={MEDIA_TYPES.TV_SHOW} />

        <div className="border-rating/30 bg-rating/10 shadow-rating/40 z-px absolute top-3.5 right-3.5 flex items-center gap-1 rounded-full border px-2 py-0.5 backdrop-blur-xs">
          <StarIcon className="fill-rating text-rating size-4.5" />
          <span className="text-rating text-base font-bold tabular-nums">{item.rating}</span>
        </div>

        <div className="flex items-baseline gap-2">
          <h3 className="text-foreground line-clamp-1 text-lg font-semibold sm:text-xl">
            {item.title}
          </h3>
          {item.year && (
            <span className="text-muted-foreground shrink-0 text-sm">({item.year})</span>
          )}
        </div>

        {item.genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.genres.map((genre) => (
              <Badge key={genre} variant="outline">
                {genre}
              </Badge>
            ))}
          </div>
        )}

        {item.overview && (
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
            {item.overview}
          </p>
        )}

        <Button
          className="w-fit bg-(--card-accent)/40 hover:bg-(--card-accent)/60"
          endIcon={
            <ArrowRightIcon className="size-3.5 transition-transform duration-500 group-hover:translate-x-0.5" />
          }
        >
          View Details
        </Button>
      </div>
    </Link>
  )
}
