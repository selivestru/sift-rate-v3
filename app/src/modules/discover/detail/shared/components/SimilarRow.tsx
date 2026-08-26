import { useIntlayer } from 'react-intlayer'

import { MEDIA_TYPES } from '~/common/constants/media-type'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/common/ui/Carousel'
import { cn } from '~/common/utils/cn'

import type { MediaSimilarItem, SimilarMediaType } from '../types/media-detail.types'
import { SimilarPosterCard } from './SimilarPosterCard'

const carouselNavClassName =
  'static! top-auto right-auto bottom-auto left-auto! size-8 translate-none! shadow-none'

interface SimilarRowProps {
  items: MediaSimilarItem[]
  title?: string
  mediaType?: SimilarMediaType
  className?: string
}

export const SimilarRow = ({
  items,
  title,
  mediaType = MEDIA_TYPES.MOVIE,
  className,
}: SimilarRowProps) => {
  const content = useIntlayer('shared')
  const resolvedTitle = title ?? content.youMightAlsoLike.value
  if (items.length === 0) return null

  const headingId = `similar-${mediaType.toLowerCase()}`

  return (
    <section className={cn('', className)} aria-labelledby={headingId}>
      <Carousel opts={{ align: 'start', dragFree: true }} className="w-full max-w-full">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id={headingId} className="text-foreground text-lg font-semibold">
            {resolvedTitle}
          </h2>
          <div className="flex shrink-0 items-center gap-1">
            <CarouselPrevious className={carouselNavClassName} />
            <CarouselNext className={carouselNavClassName} />
          </div>
        </div>
        <CarouselContent className="-ml-3">
          {items.map((item) => (
            <CarouselItem key={item.id} className="basis-[38%] pl-3 sm:basis-[28%] md:basis-1/4">
              <SimilarPosterCard item={item} mediaType={mediaType} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
