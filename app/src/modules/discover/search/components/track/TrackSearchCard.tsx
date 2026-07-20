import { Link } from '@tanstack/react-router'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'

import { MEDIA_TYPES, mediaTypeMeta } from '~/common/constants/media-type'
import { Badge } from '~/common/ui/Badge'
import { Button } from '~/common/ui/Button'
import { cn } from '~/common/utils/cn'
import { formatDuration } from '~/common/utils/formatDuration'

import type { TrackSearchItem } from '../../types/discover-search.types'

interface TrackSearchCardProps {
  item: TrackSearchItem
}

export const TrackSearchCard = ({ item }: TrackSearchCardProps) => {
  const { color, icon: MediaTypeIcon } = mediaTypeMeta[MEDIA_TYPES.TRACK]

  return (
    <Link
      to="/discover/track/$externalId"
      params={{ externalId: item.id }}
      className={cn(
        'bg-card group relative flex items-center gap-3 overflow-hidden rounded-xl p-2 pr-3 transition-all duration-300 ease-out',
        'hover:scale-[1.005] hover:bg-(--card-color)/5 active:scale-[0.995]',
        'ring-border/60 ring-1 hover:ring-(--card-color)/25',
      )}
      style={{ '--card-color': color }}
    >
      <div
        className={cn(
          'bg-muted relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg',
          {
            'ring-1 transition-all duration-300 group-hover:ring-(--card-color) ring-ring/50':
              !item.coverUrl,
          },
        )}
      >
        {item.coverUrl ? (
          <img
            src={item.coverUrl}
            alt={item.albumTitle}
            className="size-full object-cover"
            loading="lazy"
          />
        ) : (
          <MediaTypeIcon className="text-muted-foreground size-5 group-hover:text-(--card-color)" />
        )}

        {item.coverUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <MediaTypeIcon color={color} />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <h3 className="text-foreground line-clamp-1 text-sm font-semibold">{item.title}</h3>

        <p className="text-muted-foreground line-clamp-1 text-xs">
          {item.artist} <span className="opacity-50">·</span> {item.albumTitle}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {item.rank != null && (
          <Badge variant="outline" className="hidden h-5 px-1.5 text-[10px] sm:flex">
            ★ {Math.round(item.rank / 1000)}k
          </Badge>
        )}

        <span className="text-muted-foreground flex items-center gap-1 text-xs tabular-nums">
          <ClockIcon className="size-3" />
          {formatDuration(item.duration)}
        </span>

        <Button
          isIconOnly
          variant="ghost"
          className="size-8 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <ArrowRightIcon className="size-3.5" />
        </Button>
      </div>
    </Link>
  )
}
