import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { useEffect, useLayoutEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'reicon-react'

import { Button } from '~/common/ui/Button'
import {
  Dialog,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '~/common/ui/Dialog'
import { Spinner } from '~/common/ui/Spinner'
import { cn } from '~/common/utils/cn'

export type LightboxImage = {
  src: string
  alt?: string
  width?: number
  height?: number
}

interface LightboxProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  images: LightboxImage[]
  index: number
  onIndexChange: (index: number) => void
  label?: string
  className?: string
}

export const Lightbox = ({
  open,
  onOpenChange,
  images,
  index,
  onIndexChange,
  label = 'Image gallery',
  className,
}: LightboxProps) => {
  const hasImages = images.length > 0
  const safeIndex = hasImages ? Math.min(Math.max(index, 0), images.length - 1) : 0
  const current = hasImages ? images[safeIndex] : null
  const currentSrc = current?.src ?? null
  const hasMultiple = images.length > 1

  const [trackedSrc, setTrackedSrc] = useState(currentSrc)
  const [imageLoaded, setImageLoaded] = useState(false)

  useLayoutEffect(() => {
    if (currentSrc !== trackedSrc) {
      // oxlint-disable-next-line react/set-state-in-effect
      setTrackedSrc(currentSrc)
      // oxlint-disable-next-line react/set-state-in-effect
      setImageLoaded(false)
    }
  }, [currentSrc, trackedSrc])

  useEffect(() => {
    if (!open || currentSrc == null) return

    let cancelled = false
    const preload = new Image()

    const markLoaded = () => {
      if (!cancelled) setImageLoaded(true)
    }

    preload.addEventListener('load', markLoaded)
    preload.addEventListener('error', markLoaded)
    preload.src = currentSrc

    if (preload.complete) {
      markLoaded()
    }

    return () => {
      cancelled = true
      preload.removeEventListener('load', markLoaded)
      preload.removeEventListener('error', markLoaded)
    }
  }, [open, currentSrc])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && hasMultiple) {
        event.preventDefault()
        onIndexChange(safeIndex <= 0 ? images.length - 1 : safeIndex - 1)
      }
      if (event.key === 'ArrowRight' && hasMultiple) {
        event.preventDefault()
        onIndexChange(safeIndex >= images.length - 1 ? 0 : safeIndex + 1)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, hasMultiple, safeIndex, images.length, onIndexChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 h-dvh w-screen bg-black/92 backdrop-blur-md duration-300" />
        <DialogPrimitive.Popup
          data-slot="lightbox"
          className={cn(
            'data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed top-0 left-0 z-50 flex h-dvh w-screen duration-300 outline-none',
            className,
          )}
        >
          <DialogTitle className="sr-only">
            {label}
            {hasImages ? ` — ${safeIndex + 1} of ${images.length}` : ''}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {hasMultiple
              ? 'Use arrow keys to navigate between images. Press Escape to close.'
              : 'Press Escape to close.'}
          </DialogDescription>

          <div className="relative flex size-full flex-col">
            <div className="absolute top-0 right-0 left-0 z-30 flex items-center justify-between gap-3 p-3 sm:p-4">
              <p className="text-sm text-white/70 tabular-nums">
                {hasImages ? `${safeIndex + 1} / ${images.length}` : ''}
              </p>
              <DialogPrimitive.Close
                render={
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    isIconOnly
                    className="rounded-full bg-white/10 text-white hover:bg-white/20"
                    aria-label="Close"
                  />
                }
              >
                <X />
              </DialogPrimitive.Close>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-12 py-14 sm:px-16 sm:py-16">
              {open && !imageLoaded && (
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <Spinner className="size-8 text-white/70" />
                </div>
              )}

              {current != null && (
                <div key={current.src} className="absolute inset-12 sm:inset-16">
                  <img
                    src={current.src}
                    alt={current.alt ?? label}
                    className={cn(
                      'size-full object-contain',
                      open && 'transition-opacity duration-300',
                      imageLoaded ? 'opacity-100' : 'opacity-0',
                    )}
                    onLoad={() => setImageLoaded(true)}
                    draggable={false}
                  />
                </div>
              )}
            </div>

            {hasMultiple && (
              <>
                <Button
                  isIconOnly
                  type="button"
                  variant="secondary"
                  className="absolute top-1/2 left-3 z-30 size-10 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-5"
                  aria-label="Previous image"
                  onClick={() => onIndexChange(safeIndex <= 0 ? images.length - 1 : safeIndex - 1)}
                >
                  <ChevronLeft className="size-5" />
                </Button>
                <Button
                  isIconOnly
                  type="button"
                  variant="secondary"
                  className="absolute top-1/2 right-3 z-30 size-10 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-5"
                  aria-label="Next image"
                  onClick={() => onIndexChange(safeIndex >= images.length - 1 ? 0 : safeIndex + 1)}
                >
                  <ChevronRight className="size-5" />
                </Button>
              </>
            )}
          </div>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  )
}
