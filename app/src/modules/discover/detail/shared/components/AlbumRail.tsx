import { Link } from '@tanstack/react-router'

import { mediaTypeMeta } from '~/common/constants/media-type'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/common/ui/Carousel'
import { cn } from '~/common/utils/cn'

import type { MusicAlbumRailItem } from '../types/music-rail.types'

const carouselNavClassName =
  'static! top-auto right-auto bottom-auto left-auto! size-8 translate-none! shadow-none'

interface AlbumRailProps {
  title: string
  items: MusicAlbumRailItem[]
  className?: string
}

const toHeadingId = (title: string) =>
  `album-rail-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`

export const AlbumRail = ({ title, items, className }: AlbumRailProps) => {
  const MediaTypeIcon = mediaTypeMeta.ALBUM.icon

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
            <CarouselItem key={item.id} className="basis-[42%] pl-3 sm:basis-[30%] md:basis-1/4">
              <Link
                to="/discover/album/$externalId"
                params={{ externalId: item.id }}
                className="group flex w-full flex-col gap-2 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99]"
              >
                <div className="bg-muted ring-border relative aspect-square w-full overflow-hidden rounded-xl ring-1">
                  {item.coverUrl ? (
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="size-full object-cover"
                      loading="lazy"
                      width={300}
                      height={300}
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <MediaTypeIcon className="text-muted-foreground size-10" aria-hidden />
                    </div>
                  )}
                </div>
                <div className="px-0.5">
                  <p className="text-foreground line-clamp-2 text-sm leading-snug font-medium">
                    {item.title}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs tabular-nums">
                    {item.releaseDate ? item.releaseDate.slice(0, 4) : null}
                  </p>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
