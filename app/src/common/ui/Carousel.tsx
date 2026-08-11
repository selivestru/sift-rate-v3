import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'
import { createContext, use, useCallback, useEffect, useMemo, useSyncExternalStore } from 'react'
import { ChevronLeft, ChevronRight } from 'reicon-react'

import { Button } from '~/common/ui/Button'
import { cn } from '~/common/utils/cn'

export type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: 'horizontal' | 'vertical'
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = createContext<CarouselContextProps | null>(null)

export const useCarousel = () => {
  const context = use(CarouselContext)

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />')
  }

  return context
}

const useEmblaScrollFlags = (api: CarouselApi | undefined) => {
  const subscribe = (onStoreChange: () => void) => {
    if (!api) return () => {}

    const handleSelect = () => onStoreChange()
    api.on('select', handleSelect)
    api.on('reInit', handleSelect)

    return () => {
      api.off('select', handleSelect)
      api.off('reInit', handleSelect)
    }
  }

  const getSnapshot = () => {
    if (!api) return 0
    return (api.canScrollPrev() ? 1 : 0) | (api.canScrollNext() ? 2 : 0)
  }

  const flags = useSyncExternalStore(subscribe, getSnapshot, () => 0)

  return {
    canScrollPrev: (flags & 1) !== 0,
    canScrollNext: (flags & 2) !== 0,
  }
}

export const Carousel = ({
  orientation = 'horizontal',
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & CarouselProps) => {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === 'horizontal' ? 'x' : 'y',
    },
    plugins,
  )

  const { canScrollPrev, canScrollNext } = useEmblaScrollFlags(api)

  const scrollPrev = useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = useCallback(() => {
    api?.scrollNext()
  }, [api])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      scrollPrev()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      scrollNext()
    }
  }

  useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  const contextValue = useMemo<CarouselContextProps>(
    () => ({
      carouselRef,
      api,
      opts,
      orientation,
      scrollPrev,
      scrollNext,
      canScrollPrev,
      canScrollNext,
    }),
    [carouselRef, api, opts, orientation, scrollPrev, scrollNext, canScrollPrev, canScrollNext],
  )

  return (
    <CarouselContext.Provider value={contextValue}>
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn('relative max-w-full ', className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

export const CarouselContent = ({
  className,
  viewportClassName,
  ...props
}: React.ComponentProps<'div'> & {
  viewportClassName?: string
}) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div
      ref={carouselRef}
      className={cn('overflow-hidden px-1 py-2.5', viewportClassName)}
      data-slot="carousel-content"
    >
      <div
        className={cn('flex', orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col', className)}
        {...props}
      />
    </div>
  )
}

export const CarouselItem = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { orientation } = useCarousel()

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        ' shrink-0 grow-0 basis-full',
        orientation === 'horizontal' ? 'pl-4' : 'pt-4',
        className,
      )}
      {...props}
    />
  )
}

type CarouselNavButtonProps = Omit<React.ComponentProps<typeof Button>, 'children'>

export const CarouselPrevious = ({
  className,
  variant = 'outline',
  size = 'sm',
  ...props
}: CarouselNavButtonProps) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      isIconOnly
      isDisabled={!canScrollPrev}
      onClick={scrollPrev}
      className={cn(
        'absolute touch-manipulation rounded-full',
        orientation === 'horizontal'
          ? 'inset-y-0 -left-12 my-auto'
          : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
      {...props}
    >
      <ChevronLeft />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
}

export const CarouselNext = ({
  className,
  variant = 'outline',
  size = 'sm',
  ...props
}: CarouselNavButtonProps) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      isIconOnly
      isDisabled={!canScrollNext}
      onClick={scrollNext}
      className={cn(
        'absolute touch-manipulation rounded-full',
        orientation === 'horizontal'
          ? 'inset-y-0 -right-12 my-auto'
          : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
      {...props}
    >
      <ChevronRight />
      <span className="sr-only">Next slide</span>
    </Button>
  )
}
