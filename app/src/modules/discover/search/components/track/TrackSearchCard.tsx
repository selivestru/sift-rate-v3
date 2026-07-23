import { Link } from '@tanstack/react-router'
import { Clock } from 'reicon-react'

import { MEDIA_TYPES, mediaTypeMeta } from '~/common/constants/media-type'
import { Badge } from '~/common/ui/Badge'
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
        'bg-card border-border group relative flex items-center gap-3 overflow-hidden rounded-xl border p-2 pr-3 transition-colors duration-200',
        'hover:bg-accent',
        'focus-visible:ring-ring/40 focus-visible:ring-2 focus-visible:outline-none',
      )}
    >
      <div className="bg-muted relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg">
        {item.coverUrl ? (
          <img
            src={item.coverUrl}
            alt={item.albumTitle}
            className="size-full object-cover"
            loading="lazy"
          />
        ) : (
          <MediaTypeIcon className="text-muted-foreground size-5" style={{ color }} />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <h3 className="text-foreground line-clamp-1 text-sm font-semibold">{item.title}</h3>
        <p className="text-muted-foreground line-clamp-1 text-xs">
          {item.artist} · {item.albumTitle}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {item.rank != null && (
          <Badge variant="outline" className="hidden h-5 px-1.5 text-[10px] sm:flex">
            ★ {Math.round(item.rank / 1000)}k
          </Badge>
        )}

        <span className="text-muted-foreground flex items-center gap-1 text-xs tabular-nums">
          <Clock className="size-3" />
          {formatDuration(item.duration)}
        </span>
      </div>
    </Link>
  )
}
