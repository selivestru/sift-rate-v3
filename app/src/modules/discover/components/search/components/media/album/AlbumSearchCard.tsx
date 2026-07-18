import { Link } from '@tanstack/react-router'
import { Disc3Icon } from 'lucide-react'

import type { AlbumSearchItem } from '../../../types/discover-search.types'

interface AlbumSearchCardProps {
  item: AlbumSearchItem
}

export const AlbumSearchCard = ({ item }: AlbumSearchCardProps) => {
  return (
    <Link
      to="/discover/$mediaType/$externalId"
      params={{ mediaType: 'album', externalId: item.externalId }}
      className="border-border/60 bg-surface/40 hover:border-border hover:bg-surface/70 focus-visible:ring-accent/40 flex flex-col overflow-hidden rounded-2xl border transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
    >
      <span className="bg-foreground/5 text-muted flex aspect-square w-full items-center justify-center overflow-hidden">
        {item.coverUrl ? (
          <img src={item.coverUrl} alt="" className="size-full object-cover" loading="lazy" />
        ) : (
          <Disc3Icon className="size-8" strokeWidth={1.75} />
        )}
      </span>
      <div className="space-y-0.5 p-3">
        <p className="text-foreground line-clamp-2 text-sm font-semibold tracking-tight">
          {item.title}
        </p>
        <p className="text-muted truncate text-xs">
          {[item.artist, item.year].filter(Boolean).join(' · ')}
        </p>
      </div>
    </Link>
  )
}
