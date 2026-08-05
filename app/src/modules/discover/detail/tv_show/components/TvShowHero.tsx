import { useState } from 'react'
import { Star } from 'reicon-react'

import { MEDIA_TYPES, mediaTypeMeta } from '~/common/constants/media-type'
import { Badge } from '~/common/ui/Badge'
import { cn } from '~/common/utils/cn'
import { formatCompactNumber } from '~/common/utils/formatCompactNumber'

import { MediaCoverLightbox } from '../../shared'
import { MediaStateButtons } from '../../shared/components/MediaStateButtons'
import type { TvShowDetail } from '../types/tv-show-detail.types'

interface TvShowHeroProps {
  show: TvShowDetail
}

const formatYears = (start: string, end: string, inProduction: boolean) => {
  if (!start) return null
  if (inProduction || !end || end === start) {
    return inProduction && end !== start ? `${start}–` : start
  }
  return `${start}–${end}`
}

export const TvShowHero = ({ show }: TvShowHeroProps) => {
  const [overviewExpanded, setOverviewExpanded] = useState(false)
  const accent = mediaTypeMeta[MEDIA_TYPES.TV_SHOW].color
  const MediaTypeIcon = mediaTypeMeta.TV_SHOW.icon
  const showOriginal =
    Boolean(show.originalTitle) &&
    show.originalTitle.trim().toLowerCase() !== show.title.trim().toLowerCase()
  const years = formatYears(show.yearStart, show.yearEnd, show.inProduction)
  const overviewLong = show.overview.length > 280

  return (
    <div className="relative overflow-hidden rounded-t-2xl">
      {show.backdropUrl ? (
        <>
          <img
            src={show.backdropUrl}
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
                `linear-gradient(105deg, color-mix(in oklab, var(--background) 90%, ${accent}) 0%, color-mix(in oklab, var(--background) 50%, transparent) 48%, color-mix(in oklab, var(--background) 20%, transparent) 72%)`,
                'linear-gradient(180deg, color-mix(in oklab, var(--background) 15%, transparent) 0%, color-mix(in oklab, var(--background) 50%, transparent) 40%, var(--background) 100%)',
              ].join(', '),
            }}
          />
        </>
      ) : (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, color-mix(in oklab, ${accent} 20%, var(--background)), var(--background))`,
          }}
        />
      )}

      {show.imdbRating > 0 && (
        <div className="border-border/30 bg-background/75 absolute top-3 right-3 z-20 flex items-center gap-1.5 rounded-full border px-3 py-1.5 shadow-sm backdrop-blur-lg sm:top-4 sm:right-4">
          <Star weight="Filled" className="text-rating size-4 sm:size-4.5" aria-hidden />
          <span className="text-foreground text-sm font-bold tabular-nums sm:text-base">
            {show.imdbRating.toFixed(1)}
          </span>
          <span className="text-muted-foreground text-[11px] font-medium">IMDB</span>
          {show.imdbVoteCount > 0 && (
            <>
              <span className="text-muted-foreground" aria-hidden>
                ·
              </span>
              <span className="text-foreground text-[11px] font-semibold tabular-nums">
                {formatCompactNumber(show.imdbVoteCount)}
              </span>
            </>
          )}
        </div>
      )}

      <div className="relative z-10 flex flex-col gap-5 p-5 pt-6 sm:flex-row sm:items-start sm:gap-5 sm:p-6 sm:pt-8">
        <div className="bg-muted ring-border relative aspect-2/3 w-36 shrink-0 overflow-hidden rounded-xl shadow-sm ring-1 sm:w-48">
          <MediaCoverLightbox
            src={show.posterUrl}
            alt={show.title}
            priority
            width={500}
            height={750}
            fallback={
              <div className="flex size-full items-center justify-center">
                <MediaTypeIcon className="text-muted-foreground size-10" aria-hidden />
              </div>
            }
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <span className="text-xs font-medium tracking-widest uppercase" style={{ color: accent }}>
            Series
          </span>

          <div className="flex flex-col gap-1">
            <h1 className="text-foreground text-3xl leading-tight font-bold text-pretty sm:text-4xl">
              {show.title}
            </h1>
            {showOriginal && (
              <p className="text-muted-foreground text-sm text-pretty italic">
                {show.originalTitle}
              </p>
            )}
          </div>

          {show.tagline && (
            <p className="text-muted-foreground text-sm text-pretty italic">
              &ldquo;{show.tagline}&rdquo;
            </p>
          )}

          <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm">
            {years && <span className="tabular-nums">{years}</span>}
            {show.status && (
              <>
                <span className="opacity-40" aria-hidden>
                  ·
                </span>
                <Badge className="h-5 px-1.5 text-[10px] font-medium">{show.status}</Badge>
              </>
            )}
            {(show.seasonCount > 0 || show.episodeCount > 0) && (
              <>
                <span className="opacity-40" aria-hidden>
                  ·
                </span>
                <span className="tabular-nums">
                  {show.seasonCount > 0 && (
                    <>
                      {show.seasonCount} {show.seasonCount === 1 ? 'season' : 'seasons'}
                    </>
                  )}
                  {show.seasonCount > 0 && show.episodeCount > 0 && ' · '}
                  {show.episodeCount > 0 && (
                    <>
                      {show.episodeCount} {show.episodeCount === 1 ? 'episode' : 'episodes'}
                    </>
                  )}
                </span>
              </>
            )}
          </div>

          <MediaStateButtons externalId={show.id} mediaType={MEDIA_TYPES.TV_SHOW} />

          {show.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {show.genres.map((genre) => (
                <Badge key={genre}>{genre}</Badge>
              ))}
            </div>
          )}

          {show.overview && (
            <div className="pt-0.5">
              <p
                className={cn(
                  'text-sm leading-relaxed text-pretty text-muted-foreground',
                  !overviewExpanded && overviewLong && 'line-clamp-4',
                )}
              >
                {show.overview}
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
