import { Link } from '@tanstack/react-router'
import { ArrowRight, Star } from 'reicon-react'

import { MEDIA_TYPES, mediaTypeMeta } from '~/common/constants/media-type'
import { Badge } from '~/common/ui/Badge'
import { Button } from '~/common/ui/Button'
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
        'bg-card group relative flex items-stretch gap-0 overflow-hidden rounded-2xl transition-all duration-400 ease-out',
        'hover:scale-[1.01] hover:shadow-lg active:scale-[0.99]',
        'ring-border/60 ring-1 hover:ring-(--card-accent)/25',
      )}
      style={{
        '--card-accent': color,
      }}
    >
      <div className="bg-muted relative aspect-2/3 w-24 shrink-0 overflow-hidden rounded-l-2xl sm:w-32">
        {item.coverUrl ? (
          <img
            src={item.coverUrl}
            alt={item.title}
            className="size-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <MediaTypeIcon className="text-muted-foreground size-10" />
          </div>
        )}

        <div
          className="absolute top-0 left-1/2 z-10 h-4 w-2.5 -translate-x-1/2 rounded-b-sm transition-all duration-300 group-hover:h-5"
          style={{ background: color }}
        />
      </div>

      <span className="absolute inset-y-0 left-24 z-20 w-1 bg-(--card-accent)/25 transition-colors duration-300 group-hover:bg-(--card-accent) sm:left-32" />

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-3 pl-4">
        <MediaTypeBadge mediaType={MEDIA_TYPES.BOOK} className="w-fit py-0.5 text-[10px]" />

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
            <span className="flex items-center gap-0.5 font-medium text-(--card-accent) tabular-nums">
              <Star className="size-3.5 fill-current" />
              {item.rating.toFixed(1)}
            </span>
          )}
        </div>

        {item.categories.length > 0 && (
          <div className="mt-0.5 flex flex-wrap gap-1">
            {item.categories.map((category) => (
              <Badge key={category} variant="outline">
                {category}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Button
        isIconOnly
        variant="ghost"
        className="absolute top-2 right-2 z-20 size-8 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <ArrowRight className="size-3.5" />
      </Button>
    </Link>
  )
}
