import { Link } from '@tanstack/react-router'
import { ArrowRight, Star } from 'reicon-react'

import { MEDIA_TYPES, mediaTypeMeta } from '~/common/constants/media-type'
import { Badge } from '~/common/ui/Badge'
import { Button } from '~/common/ui/Button'
import { cn } from '~/common/utils/cn'

import type { GameSearchItem } from '../../types/discover-search.types'

interface GameSearchCardProps {
  item: GameSearchItem
}

export const GameSearchCard = ({ item }: GameSearchCardProps) => {
  const { color, icon: MediaTypeIcon } = mediaTypeMeta[MEDIA_TYPES.GAME]
  const visiblePlatforms = item.platforms
  const extraPlatforms = item.platforms.length - visiblePlatforms.length
  const visibleGenres = item.genres

  return (
    <Link
      to="/discover/game/$externalId"
      params={{ externalId: item.id }}
      className={cn(
        'bg-card group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-400 ease-out',
        'hover:scale-[1.02] hover:shadow-lg active:scale-[0.99]',
      )}
      style={{
        '--card-accent': color,
      }}
    >
      <div className="bg-muted relative aspect-3/4 w-full overflow-hidden">
        {item.coverUrl ? (
          <img
            src={item.coverUrl}
            alt={item.title}
            className="size-full object-cover transition-transform duration-400 ease-out group-hover:scale-105 group-active:scale-[0.99]"
            loading="lazy"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <MediaTypeIcon className="text-muted-foreground size-12" />
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/40 via-black/5 to-transparent transition-all duration-400 group-hover:-translate-y-1 group-hover:opacity-0" />

        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent transition-all duration-400 group-hover:translate-y-1 group-hover:opacity-0" />

        {(item.year || item.rating) && (
          <div className="z-px transition-backdrop absolute top-2.5 right-2.5 left-2.5 flex items-center justify-between text-sm font-bold duration-400 group-hover:-translate-y-1 group-hover:opacity-0">
            {item.year && (
              <div className="border-border bg-border shadow-border/30 flex items-center gap-1 rounded-full border px-2 py-0.5 backdrop-blur-sm">
                <span className="tabular-nums">{item.year}</span>
              </div>
            )}

            {item.rating && (
              <div className="border-rating/30 bg-rating/15 shadow-rating/30 flex items-center gap-1 rounded-full border px-2 py-0.5 backdrop-blur-sm">
                <Star className="fill-rating text-rating size-3.5" />
                <span className="text-rating tabular-nums">{item.rating}</span>
              </div>
            )}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 z-10 overflow-hidden p-3 transition-all duration-400 group-hover:translate-y-1 group-hover:opacity-0">
          <h3 className="mb-1.5 line-clamp-2 text-sm leading-snug font-semibold text-white sm:text-base">
            {item.title}
          </h3>

          <div className="flex flex-col gap-1.5">
            {visiblePlatforms.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {visiblePlatforms.map((platform) => (
                  <Badge
                    key={platform}
                    variant="outline"
                    className="transition-backdrop h-5 border-white/10 bg-white/15 px-1.5 text-[10px] text-white backdrop-blur-sm"
                  >
                    {platform}
                  </Badge>
                ))}
                {extraPlatforms > 0 && (
                  <Badge
                    variant="outline"
                    className="transition-backdrop h-5 border-white/10 bg-white/15 px-1.5 text-[10px] text-white/80 backdrop-blur-sm"
                  >
                    +{extraPlatforms}
                  </Badge>
                )}
              </div>
            )}

            {visibleGenres.length > 0 && (
              <p className="line-clamp-1 text-[11px] text-white/60">{visibleGenres.join(' · ')}</p>
            )}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-[2px] transition-opacity duration-400 group-hover:opacity-100">
        <Button variant="success">
          View Game
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </Link>
  )
}
