import { Link } from '@tanstack/react-router'

import { RatingBadge } from '~/common/ui/RatingBadge'
import { cn } from '~/common/utils/cn'

import type { MovieCollection as MovieCollectionData } from '../types/movie-detail.types'

interface MovieCollectionProps {
  collection: MovieCollectionData
  currentMovieId: string
}

export const MovieCollection = ({ collection, currentMovieId }: MovieCollectionProps) => {
  return (
    <section className="flex flex-col gap-4" aria-labelledby="movie-collection-heading">
      <h2 id="movie-collection-heading" className="text-foreground text-lg font-semibold">
        {collection.name}
      </h2>

      <ol className="divide-border flex flex-col divide-y">
        {collection.parts.map((part, index) => (
          <li
            key={part.id}
            className={cn('hover:bg-accent px-2', currentMovieId === part.id && 'bg-border')}
          >
            <Link
              to="/discover/movie/$externalId"
              params={{ externalId: part.id }}
              className={cn(
                'flex items-center justify-between gap-4 py-2',
                'text-sm transition-colors hover:text-foreground',
                'focus-visible:ring-ring rounded-md focus-visible:ring-2 focus-visible:outline-none',
              )}
              onClick={(event) => {
                if (currentMovieId === part.id) {
                  event.preventDefault()
                }
              }}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="text-muted-foreground w-5 shrink-0 tabular-nums">
                  {collection.parts.length - index}
                </span>
                <span className="text-foreground truncate font-medium">{part.title}</span>
              </span>
              <span className="text-muted-foreground flex shrink-0 items-center gap-4 tabular-nums">
                {part.year && <span>{part.year}</span>}
                {part.rating != null && part.rating > 0 && <RatingBadge rating={part.rating} />}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
