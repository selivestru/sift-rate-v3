import { useIntlayer } from 'react-intlayer'

import { mediaTypeMeta } from '~/common/constants/media-type'
import { RatingBadge } from '~/common/ui/RatingBadge'

import type { TvSeasonSummary } from '../types/tv-show-detail.types'

interface TvSeasonCardProps {
  season: TvSeasonSummary
  accent: string
}

export const TvSeasonCard = ({ season, accent }: TvSeasonCardProps) => {
  const content = useIntlayer('discover-detail')
  const MediaTypeIcon = mediaTypeMeta.TV_SHOW.icon
  const isSpecials = season.seasonNumber === 0
  const label = isSpecials ? content.specials.value : `S${season.seasonNumber}`

  return (
    <div className="group flex w-full flex-col gap-2 transition-transform duration-300 hover:scale-[1.03]">
      <div className="bg-muted ring-border group-hover:ring-border relative aspect-2/3 w-full overflow-hidden rounded-xl ring-1 transition-[box-shadow,ring-color] duration-300 group-hover:shadow-lg">
        {season.posterUrl ? (
          <img
            src={season.posterUrl}
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
      </div>

      <div className="px-0.5">
        <p className="text-foreground line-clamp-2 text-sm leading-snug font-medium">
          {season.name}
        </p>
        {season.episodeCount > 0 && (
          <p className="text-muted-foreground text-xs tabular-nums">
            {content.episodeCount(season.episodeCount)}
          </p>
        )}
      </div>
    </div>
  )
}
