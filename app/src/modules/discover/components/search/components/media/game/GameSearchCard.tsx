import { Link } from '@tanstack/react-router'
import { Gamepad2Icon } from 'lucide-react'

import type { GameSearchItem } from '../../../types/discover-search.types'

interface GameSearchCardProps {
  item: GameSearchItem
}

export const GameSearchCard = ({ item }: GameSearchCardProps) => {
  return (
    <Link
      to="/discover/$mediaType/$externalId"
      params={{ mediaType: 'game', externalId: item.externalId }}
      className="border-border/60 bg-surface/40 hover:border-border hover:bg-surface/70 focus-visible:ring-primary/40 flex flex-col overflow-hidden rounded-2xl border transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
    >
      <span className="bg-foreground/5 text-muted-foreground flex aspect-3/4 w-full items-center justify-center overflow-hidden">
        {item.coverUrl ? (
          <img src={item.coverUrl} alt="" className="size-full object-cover" loading="lazy" />
        ) : (
          <Gamepad2Icon className="size-8" strokeWidth={1.75} />
        )}
      </span>
      <div className="space-y-0.5 p-3">
        <p className="line-clamp-2 text-sm font-semibold tracking-tight">{item.title}</p>
        {item.year !== undefined && (
          <p className="text-muted-foreground text-xs tabular-nums">{item.year}</p>
        )}
      </div>
    </Link>
  )
}
