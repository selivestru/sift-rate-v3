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

const toHeadingId = (title: string) =>
  `similar-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`

export const SimilarRow = ({
  items,
  title = 'You might also like',
  mediaType = MEDIA_TYPES.MOVIE,
  className,
}: SimilarRowProps) => {
  if (items.length === 0) return null

  const headingId = toHeadingId(title)

  return (
    <section className={cn('', className)} aria-labelledby={headingId}>
      <Carousel opts={{ align: 'start', dragFree: true }} className="w-full max-w-full">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id={headingId} className="text-foreground text-lg font-semibold">
            {title}
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
