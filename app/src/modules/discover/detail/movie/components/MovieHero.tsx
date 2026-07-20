import { ClapperboardIcon, StarIcon } from 'lucide-react'
import { useState } from 'react'

import { MEDIA_TYPES, mediaTypeMeta } from '~/common/constants/media-type'
import { Badge } from '~/common/ui/Badge'
import { cn } from '~/common/utils/cn'
import { formatDate } from '~/common/utils/formatDate'
import { formatRuntime } from '~/common/utils/formatRuntime'

import { MediaCoverLightbox } from '../../shared'
import type { MovieDetail } from '../types/movie-detail.types'

interface MovieHeroProps {
  movie: MovieDetail
}

export const MovieHero = ({ movie }: MovieHeroProps) => {
  const [overviewExpanded, setOverviewExpanded] = useState(false)
  const accent = mediaTypeMeta[MEDIA_TYPES.MOVIE].color
  const runtime = formatRuntime(movie.runtimeMinutes)
  const showOriginal =
    Boolean(movie.originalTitle) &&
    movie.originalTitle.trim().toLowerCase() !== movie.title.trim().toLowerCase()
  const overviewLong = movie.overview.length > 280

  return (
    <div className="relative overflow-hidden rounded-t-2xl">
      {movie.backdropUrl ? (
        <>
          <img
            src={movie.backdropUrl}
            alt=""
            aria-hidden
            className="absolute inset-0 size-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: [
                'linear-gradient(100deg, color-mix(in oklab, var(--background) 88%, transparent) 0%, color-mix(in oklab, var(--background) 55%, transparent) 42%, color-mix(in oklab, var(--background) 25%, transparent) 70%)',
                'linear-gradient(180deg, color-mix(in oklab, var(--background) 20%, transparent) 0%, color-mix(in oklab, var(--background) 55%, transparent) 45%, var(--background) 100%)',
              ].join(', '),
            }}
          />
        </>
      ) : (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, color-mix(in oklab, ${accent} 18%, var(--background)), var(--background))`,
          }}
        />
      )}

      <div className="relative z-10 flex flex-col gap-5 p-5 pt-6 sm:flex-row sm:items-end sm:gap-5 sm:p-6 sm:pt-8">
        <div className="bg-muted ring-foreground/10 relative aspect-2/3 w-40 shrink-0 overflow-hidden rounded-xl shadow-xl ring-1 sm:w-52">
          <MediaCoverLightbox
            src={movie.posterUrl}
            alt={movie.title}
            priority
            width={500}
            height={750}
            fallback={
              <div className="flex size-full items-center justify-center">
                <ClapperboardIcon className="text-muted-foreground size-10" aria-hidden />
              </div>
            }
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <span className="text-xs font-medium tracking-widest uppercase" style={{ color: accent }}>
            Movie
          </span>

          <div className="flex flex-col gap-1">
            <h1 className="text-foreground text-3xl leading-tight font-bold text-pretty sm:text-4xl">
              {movie.title}
            </h1>
            {showOriginal && (
              <p className="text-muted-foreground text-sm text-pretty italic">
                {movie.originalTitle}
              </p>
            )}
          </div>

          {movie.tagline && (
            <p className="text-muted-foreground text-sm text-pretty italic">
              &ldquo;{movie.tagline}&rdquo;
            </p>
          )}

          <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm">
            {movie.year && <span className="tabular-nums">{movie.year}</span>}
            {runtime && (
              <>
                <span className="opacity-40" aria-hidden>
                  ·
                </span>
                <span className="tabular-nums">{runtime}</span>
              </>
            )}
            {movie.status && movie.status !== 'Released' && (
              <>
                <span className="opacity-40" aria-hidden>
                  ·
                </span>
                <span className="text-xs">{movie.status}</span>
              </>
            )}
            {movie.releaseDate && (
              <>
                <span className="opacity-40" aria-hidden>
                  ·
                </span>
                <span className="text-xs">{formatDate(movie.releaseDate)}</span>
              </>
            )}
          </div>

          {movie.tmdbRating > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <div
                className="border-foreground/10 bg-foreground/8 flex items-center gap-1 rounded-full border px-2 py-0.5 backdrop-blur-sm"
                title={`${movie.tmdbVoteCount.toLocaleString()} TMDB votes`}
              >
                <StarIcon className="stroke-rating fill-rating size-3.5" aria-hidden />
                <span className="text-foreground text-xs font-semibold tabular-nums">
                  {movie.tmdbRating.toFixed(1)}
                </span>
                <span className="text-muted-foreground text-[10px]">TMDB</span>
              </div>
            </div>
          )}

          {movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {movie.genres.map((genre) => (
                <Badge key={genre} variant="outline">
                  {genre}
                </Badge>
              ))}
            </div>
          )}

          {movie.overview && (
            <div className="pt-0.5">
              <p
                className={cn(
                  'text-sm leading-relaxed text-pretty text-muted-foreground',
                  !overviewExpanded && overviewLong && 'line-clamp-4',
                )}
              >
                {movie.overview}
              </p>
              {overviewLong && !overviewExpanded && (
                <button
                  type="button"
                  onClick={() => setOverviewExpanded(true)}
                  className="text-foreground mt-1 cursor-pointer text-xs font-medium underline-offset-2 hover:underline"
                >
                  Show more
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
