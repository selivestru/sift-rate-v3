import { Link } from '@tanstack/react-router'
import { Music2Icon } from 'lucide-react'

import { formatDuration } from '~/common/utils/formatDuration'

import type { TrackSearchItem } from '../../../types/discover-search.types'

interface TrackSearchCardProps {
  item: TrackSearchItem
}

export const TrackSearchCard = ({ item }: TrackSearchCardProps) => {
  return (
    <Link
      to="/discover/$mediaType/$externalId"
      params={{ mediaType: 'track', externalId: item.externalId }}
      className="border-border/60 bg-surface/40 hover:border-border hover:bg-surface/70 focus-visible:ring-accent/40 flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
    >
      <span className="bg-foreground/5 text-muted flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
        {item.coverUrl ? (
          <img src={item.coverUrl} alt="" className="size-full object-cover" loading="lazy" />
        ) : (
          <Music2Icon className="size-4" strokeWidth={1.75} />
        )}
      </span>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-foreground truncate text-sm font-medium tracking-tight">{item.title}</p>
        <p className="text-muted truncate text-xs">
          {[item.artist, item.album].filter(Boolean).join(' · ')}
        </p>
      </div>
      {item.durationSec !== undefined && (
        <span className="text-muted shrink-0 text-xs tabular-nums">
          {formatDuration(item.durationSec)}
        </span>
      )}
    </Link>
  )
}
