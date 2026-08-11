import { Link } from '@tanstack/react-router'
import { Star } from 'reicon-react'

import { MEDIA_TYPES, mediaTypeMeta } from '~/common/constants/media-type'
import { Badge } from '~/common/ui/Badge'
import { MediaTypeBadge } from '~/common/ui/MediaTypeBadge'
import { cn } from '~/common/utils/cn'

import type { MovieSearchItem } from '../../types/discover-search.types'

interface MovieSearchCardProps {
  item: MovieSearchItem
}

export const MovieSearchCard = ({ item }: MovieSearchCardProps) => {
  const { color, icon: MediaTypeIcon } = mediaTypeMeta[MEDIA_TYPES.MOVIE]

  return (
    <Link
      to="/discover/movie/$externalId"
      params={{ externalId: item.id }}
      className={cn(
        'bg-card border-border group relative flex gap-4 overflow-hidden rounded-xl border transition-colors duration-200',
        'hover:bg-accent',
        'focus-visible:ring-ring/40 focus-visible:ring-2 focus-visible:outline-none',
      )}
    >
      <div
        className={cn(
          'relative aspect-2/3 w-27.5 shrink-0 overflow-hidden border-r border-border sm:w-37.5',
        )}
      >
        {item.posterUrl ? (
          <img
            src={item.posterUrl}
            alt={item.title}
            className="size-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="bg-muted flex size-full items-center justify-center">
            <MediaTypeIcon className="size-10" style={{ color }} />
          </div>
        )}
      </div>

      <div className="relative flex flex-1 flex-col justify-center gap-2 py-4 pr-4">
        <MediaTypeBadge mediaType={MEDIA_TYPES.MOVIE} />

        {item.rating != null && (
          <div className="border-border bg-muted absolute top-3.5 right-3.5 flex items-center gap-1 rounded-full border px-2 py-0.5">
            <Star weight="Filled" className="text-rating size-3.5" />
            <span className="text-rating text-sm font-semibold tabular-nums">{item.rating}</span>
          </div>
        )}

        <div className="flex items-baseline gap-2 pr-16">
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
              <Badge key={genre}>{genre}</Badge>
            ))}
          </div>
        )}

        {item.overview && (
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
            {item.overview}
          </p>
        )}
      </div>
    </Link>
  )
}
