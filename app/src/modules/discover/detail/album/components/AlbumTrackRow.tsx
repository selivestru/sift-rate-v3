import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'reicon-react'

import { mediaTypeMeta } from '~/common/constants/media-type'
import { Badge } from '~/common/ui/Badge'
import { cn } from '~/common/utils/cn'
import { formatDuration } from '~/common/utils/formatDuration'

import type { AlbumTrack } from '../types/album-detail.types'

interface AlbumTrackRowProps {
  track: AlbumTrack
  index: number
  coverUrl?: string | null
}

export const AlbumTrackRow = ({ track, index, coverUrl }: AlbumTrackRowProps) => {
  const trackNumber = String(track.trackPosition ?? index + 1).padStart(2, '0')
  const MediaTypeIcon = mediaTypeMeta.ALBUM.icon

  return (
    <Link
      to="/discover/track/$externalId"
      params={{ externalId: track.id }}
      className={cn(
        'group relative flex min-h-14 items-center gap-3 overflow-hidden rounded-2xl bg-card p-2 pr-3 ring-1 ring-border',
        'transition-all duration-300 ease-out',
        'hover:scale-[1.01] hover:bg-card hover:shadow-md hover:ring-border',
        'active:scale-[0.99]',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
      )}
    >
      <div className="bg-muted relative size-10 shrink-0 overflow-hidden rounded-xl sm:size-11">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt=""
            aria-hidden
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <MediaTypeIcon className="text-muted-foreground size-4" aria-hidden />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[1px]">
          <span className="text-[11px] font-semibold tracking-wide text-white tabular-nums">
            {trackNumber}
          </span>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-foreground truncate text-sm leading-snug font-medium">
          {track.title}
        </span>
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <span className="tabular-nums">{formatDuration(track.duration)}</span>
          {track.explicit && (
            <Badge variant="outline" className="h-4 px-1 text-[9px] uppercase">
              E
            </Badge>
          )}
        </span>
      </div>

      <ChevronRight
        className="text-muted-foreground size-4 shrink-0 opacity-40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
        aria-hidden
      />
    </Link>
  )
}
