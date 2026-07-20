import { useState } from 'react'

import { Lightbox } from '~/common/ui/Lightbox'
import { cn } from '~/common/utils/cn'

interface MediaCoverLightboxProps {
  src: string | null
  alt: string
  className?: string
  imageClassName?: string
  fallback: React.ReactNode
  width?: number
  height?: number
  priority?: boolean
  label?: string
}

export const MediaCoverLightbox = ({
  src,
  alt,
  className,
  imageClassName,
  fallback,
  width,
  height,
  priority = false,
  label,
}: MediaCoverLightboxProps) => {
  const [open, setOpen] = useState(false)

  if (!src) {
    return <div className={cn('size-full', className)}>{fallback}</div>
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'relative block size-full cursor-zoom-in overflow-hidden border-0 bg-transparent p-0',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:outline-none',
          className,
        )}
        aria-label={`View cover of ${alt}`}
      >
        <img
          src={src}
          alt={alt}
          className={cn('size-full object-cover', imageClassName)}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding="async"
          width={width}
          height={height}
          draggable={false}
        />
      </button>

      <Lightbox
        open={open}
        onOpenChange={setOpen}
        images={[{ src, alt }]}
        index={0}
        onIndexChange={() => {}}
        label={label ?? alt}
      />
    </>
  )
}
