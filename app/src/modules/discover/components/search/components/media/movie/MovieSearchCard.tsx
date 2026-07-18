import { Link } from '@tanstack/react-router'
import { ClapperboardIcon } from 'lucide-react'

import type { MovieSearchItem } from '../../../types/discover-search.types'

interface MovieSearchCardProps {
  item: MovieSearchItem
}

export const MovieSearchCard = ({ item }: MovieSearchCardProps) => {
  return (
    <Link
      to="/discover/$mediaType/$externalId"
      params={{ mediaType: 'movie', externalId: item.externalId }}
      className="border-border/60 bg-surface/40 hover:border-border hover:bg-surface/70 focus-visible:ring-primary/40 flex items-center gap-3 rounded-2xl border p-3 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none sm:gap-4 sm:p-3.5"
    >
      <span className="bg-foreground/5 text-muted-foreground flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl">
        {item.posterUrl ? (
          <img src={item.posterUrl} alt="" className="size-full object-cover" loading="lazy" />
        ) : (
          <ClapperboardIcon className="size-5" strokeWidth={1.75} />
        )}
      </span>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="truncate text-sm font-semibold tracking-tight sm:text-base">{item.title}</p>
        {item.year !== undefined && (
          <p className="text-muted-foreground text-xs tabular-nums sm:text-sm">{item.year}</p>
        )}
      </div>
    </Link>
  )
}
