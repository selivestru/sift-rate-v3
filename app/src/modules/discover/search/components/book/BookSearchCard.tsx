import { Link } from '@tanstack/react-router'
import { Star } from 'reicon-react'

import { MEDIA_TYPES, mediaTypeMeta } from '~/common/constants/media-type'
import { Badge } from '~/common/ui/Badge'
import { MediaTypeBadge } from '~/common/ui/MediaTypeBadge'
import { cn } from '~/common/utils/cn'

import type { BookSearchItem } from '../../types/discover-search.types'

interface BookSearchCardProps {
  item: BookSearchItem
}

export const BookSearchCard = ({ item }: BookSearchCardProps) => {
  const { color, icon: MediaTypeIcon } = mediaTypeMeta[MEDIA_TYPES.BOOK]

  return (
    <Link
      to="/discover/book/$externalId"
      params={{ externalId: item.id }}
      className={cn(
        'bg-card border-border group relative flex items-stretch gap-0 overflow-hidden rounded-xl border transition-colors duration-200',
        'hover:bg-accent',
        'focus-visible:ring-ring/40 focus-visible:ring-2 focus-visible:outline-none',
      )}
    >
      <div className="bg-muted border-border relative aspect-2/3 w-24 shrink-0 overflow-hidden border-r sm:w-32">
        {item.coverUrl ? (
          <img
            src={item.coverUrl}
            alt={item.title}
            className="size-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <MediaTypeIcon className="text-muted-foreground size-10" style={{ color }} />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-3">
        <MediaTypeBadge mediaType={MEDIA_TYPES.BOOK} className="w-fit" size="sm" />

        <h3 className="text-foreground line-clamp-2 text-base leading-snug font-semibold">
          {item.title}
        </h3>

        {item.authors.length > 0 && (
          <p className="text-muted-foreground line-clamp-1 text-xs">{item.authors.join(', ')}</p>
        )}

        <div className="text-muted-foreground mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 text-xs">
          {item.year && <span className="tabular-nums">{item.year}</span>}
          {item.pageCount != null && <span className="tabular-nums">· {item.pageCount} pp</span>}
          {item.rating != null && (
            <span className="text-rating flex items-center gap-0.5 font-medium tabular-nums">
              <Star weight="Filled" className="size-3.5" />
              {item.rating.toFixed(1)}
            </span>
          )}
        </div>

        {item.categories.length > 0 && (
          <div className="mt-0.5 flex flex-wrap gap-1">
            {item.categories.map((category) => (
              <Badge key={category}>{category}</Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
