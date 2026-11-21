import { useIntlayer } from 'react-intlayer'
import { Star } from 'reicon-react'

import { MEDIA_TYPES, mediaTypeMeta } from '~/common/constants/media-type'
import { RatingBadge } from '~/common/ui/RatingBadge'
import { useAuthStore } from '~/modules/auth'
import { UpsertReviewDialog } from '~/modules/review'
import type { Review } from '~/modules/review'

import type { TvSeasonSummary } from '../types/tv-show-detail.types'

interface TvSeasonCardProps {
  season: TvSeasonSummary
  accent: string
  externalId: string
  seasonReview: Review | null
  showPosterUrl: string | null
}

export const TvSeasonCard = ({
  season,
  accent,
  externalId,
  seasonReview,
  showPosterUrl,
}: TvSeasonCardProps) => {
  const content = useIntlayer('discover-detail')
  const MediaTypeIcon = mediaTypeMeta.TV_SHOW.icon
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isSpecials = season.seasonNumber === 0
  const label = isSpecials ? content.specials.value : `S${season.seasonNumber}`
  const posterUrl = season.posterUrl ?? showPosterUrl

  return (
    <div className="group flex h-full w-full flex-col gap-2 transition-transform duration-300 hover:scale-[1.03]">
      <div className="bg-muted ring-border group-hover:ring-border relative aspect-2/3 w-full overflow-hidden rounded-xl ring-1 transition-[box-shadow,ring-color] duration-300 group-hover:shadow-lg">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={season.name}
            className="size-full object-cover"
            loading="lazy"
            width={342}
            height={513}
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <MediaTypeIcon className="text-muted-foreground size-8 opacity-60" aria-hidden />
          </div>
        )}

        <div
          className="absolute top-1.5 left-1.5 rounded-md px-2 py-0.5 text-xs font-bold tracking-wide text-white tabular-nums shadow-sm backdrop-blur-sm"
          style={{ background: `color-mix(in oklab, ${accent} 85%, black)` }}
        >
          {label}
        </div>

        {season.imdbRating > 0 && (
          <RatingBadge
            rating={season.imdbRating}
            size="xs"
            className="absolute top-1.5 right-1.5"
          />
        )}

        {isAuthenticated && season.seasonNumber > 0 && (
          <UpsertReviewDialog
            media={{ mediaType: MEDIA_TYPES.TV_SHOW, externalId }}
            lockedSeasonNumber={season.seasonNumber}
            initialData={seasonReview}
          >
            {({ open }) =>
              seasonReview ? (
                <button
                  type="button"
                  onClick={open}
                  aria-label={content.rateSeason({ season: season.seasonNumber })}
                  className="focus-visible:ring-ring/40 absolute right-1.5 bottom-1.5 rounded-full outline-none focus-visible:ring-2"
                >
                  <RatingBadge
                    rating={seasonReview.rating}
                    variant={seasonReview.rating === 10 ? 'rating' : 'default'}
                    className="shadow-sm backdrop-blur-sm transition-transform duration-200 hover:scale-105"
                  />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={open}
                  aria-label={content.rateSeason({ season: season.seasonNumber })}
                  className="focus-visible:ring-ring/40 absolute right-1.5 bottom-1.5 flex size-7 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors duration-200 outline-none hover:bg-black/70 focus-visible:ring-2"
                >
                  <Star weight="Filled" className="size-3.5" aria-hidden />
                </button>
              )
            }
          </UpsertReviewDialog>
        )}
      </div>

      <div className="px-0.5">
        <p className="text-foreground line-clamp-2 h-[2.40625rem] text-sm leading-snug font-medium">
          {season.name}
        </p>
        <p className="text-muted-foreground h-[1.03125rem] text-xs tabular-nums">
          {season.episodeCount > 0 ? content.episodeCount(season.episodeCount) : null}
        </p>
      </div>
    </div>
  )
}
