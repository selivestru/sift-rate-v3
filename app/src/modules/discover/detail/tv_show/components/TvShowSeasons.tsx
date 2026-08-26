import { useIntlayer } from 'react-intlayer'

import { MEDIA_TYPES, mediaTypeMeta } from '~/common/constants/media-type'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/common/ui/Carousel'
import { cn } from '~/common/utils/cn'

import type { TvSeasonSummary } from '../types/tv-show-detail.types'
import { TvSeasonCard } from './TvSeasonCard'

const carouselNavClassName =
  'static! top-auto right-auto bottom-auto left-auto! size-8 translate-none! shadow-none'

interface TvShowSeasonsProps {
  seasons: TvSeasonSummary[]
  className?: string
}

export const TvShowSeasons = ({ seasons, className }: TvShowSeasonsProps) => {
  const content = useIntlayer('discover-detail')
  const accent = mediaTypeMeta[MEDIA_TYPES.TV_SHOW].color

  if (seasons.length === 0) {
    return (
      <div className="bg-muted ring-border rounded-2xl px-4 py-10 text-center ring-1">
        <p className="text-foreground text-sm font-medium">{content.noSeasons.value}</p>
        <p className="text-muted-foreground mt-1 text-xs">{content.seasonsUnavailable.value}</p>
      </div>
    )
  }

  return (
    <section className={cn('', className)} aria-labelledby="seasons-heading">
      <Carousel opts={{ align: 'start', dragFree: true }} className="w-full max-w-full">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id="seasons-heading" className="text-foreground text-lg font-semibold">
            {content.seasons.value}
          </h2>
          {seasons.length > 3 && (
            <div className="flex shrink-0 items-center gap-1">
              <CarouselPrevious className={carouselNavClassName} />
              <CarouselNext className={carouselNavClassName} />
            </div>
          )}
        </div>
        <CarouselContent className="-ml-3">
          {seasons.map((season) => (
            <CarouselItem
              key={season.seasonNumber}
              className="basis-[32%] pl-3 sm:basis-[24%] md:basis-1/5"
            >
              <TvSeasonCard season={season} accent={accent} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
