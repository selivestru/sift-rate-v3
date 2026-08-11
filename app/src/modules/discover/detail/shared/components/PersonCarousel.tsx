import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/common/ui/Carousel'
import { cn } from '~/common/utils/cn'

import type { MediaPerson } from '../types/media-person.types'
import { PersonCard } from './PersonCard'

const carouselNavClassName =
  'static! top-auto right-auto bottom-auto left-auto! size-8 translate-none! shadow-none'

interface PersonCarouselProps {
  people: MediaPerson[]
  title?: string
  titleId?: string
  subtitleKey?: 'character' | 'job'
  className?: string
}

export const PersonCarousel = ({
  people,
  title = 'Cast',
  titleId,
  subtitleKey = 'character',
  className,
}: PersonCarouselProps) => {
  if (people.length === 0) return null

  const headingId = titleId ?? `person-carousel-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

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
          {people.map((person) => (
            <CarouselItem
              key={`${person.id}-${person.character ?? person.job ?? ''}`}
              className="basis-[30%] pl-3 sm:basis-1/4 md:basis-1/5"
            >
              <PersonCard
                name={person.name}
                profileUrl={person.profileUrl}
                subtitle={subtitleKey === 'character' ? person.character : person.job}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
