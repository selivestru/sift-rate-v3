import { Link } from '@tanstack/react-router'
import { Star } from 'reicon-react'

import { MEDIA_TYPES, mediaTypeMeta } from '~/common/constants/media-type'
import { Badge } from '~/common/ui/Badge'
import { cn } from '~/common/utils/cn'

import type { GameSearchItem } from '../../types/discover-search.types'

interface GameSearchCardProps {
  item: GameSearchItem
}

export const GameSearchCard = ({ item }: GameSearchCardProps) => {
  const { color, icon: MediaTypeIcon } = mediaTypeMeta[MEDIA_TYPES.GAME]
  const visiblePlatforms = item.platforms.slice(0, 3)
  const extraPlatforms = item.platforms.length - visiblePlatforms.length

  return (
    <Link
      to="/discover/game/$externalId"
      params={{ externalId: item.id }}
      className={cn(
        'bg-card border-border group relative flex flex-col overflow-hidden rounded-xl border transition-colors duration-200',
        'hover:bg-accent',
        'focus-visible:ring-ring/40 focus-visible:ring-2 focus-visible:outline-none',
      )}
    >
      <div className="bg-muted relative aspect-3/4 w-full overflow-hidden">
        {item.coverUrl ? (
          <img
            src={item.coverUrl}
            alt={item.title}
            className="size-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <MediaTypeIcon className="text-muted-foreground size-12" style={{ color }} />
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/30 to-transparent pt-16" />

        {(item.year || item.rating) && (
          <div className="absolute top-2.5 right-2.5 left-2.5 flex items-center justify-between">
            {item.year ? (
              <Badge variant="blur" className="text-white">
                {item.year}
              </Badge>
            ) : (
              <span />
            )}
            {item.rating && (
              <div className="border-border bg-card flex items-center gap-1 rounded-full border px-2 py-0.5">
                <Star weight="Filled" className="text-rating size-3.5" />
                <span className="text-rating text-xs font-semibold tabular-nums">
                  {item.rating}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 p-3">
        <h3 className="text-foreground line-clamp-2 text-sm leading-snug font-semibold sm:text-base">
          {item.title}
        </h3>

        {visiblePlatforms.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {visiblePlatforms.map((platform) => (
              <Badge key={platform} variant="outline" size="sm">
                {platform}
              </Badge>
            ))}
            {extraPlatforms > 0 && (
              <Badge variant="outline" size="sm">
                +{extraPlatforms}
              </Badge>
            )}
          </div>
        )}

        {item.genres.length > 0 && (
          <p className="text-muted-foreground line-clamp-1 text-[11px]">
            {item.genres.join(' · ')}
          </p>
        )}
      </div>
    </Link>
  )
}
