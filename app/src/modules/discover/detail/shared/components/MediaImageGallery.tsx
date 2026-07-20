import { useState } from 'react'

import { Button } from '~/common/ui/Button'
import { Lightbox, type LightboxImage } from '~/common/ui/Lightbox'
import { Tabs, TabsIndicator, TabsList, TabsTab } from '~/common/ui/Tabs'
import { cn } from '~/common/utils/cn'

import type { MediaImage } from '../types/media-detail.types'
import { GalleryGrid } from './GalleryGrid'

type GalleryTab = 'posters' | 'backdrops'

const PREVIEW_LIMIT = {
  posters: 3,
  backdrops: 4,
} as const

interface MediaImageGalleryProps {
  backdrops: MediaImage[]
  posters: MediaImage[]
  title: string
  className?: string
  posterLabel?: string
  backdropLabel?: string
  posterAspect?: 'portrait' | 'landscape'
  backdropAspect?: 'portrait' | 'landscape'
  preferBackdrops?: boolean
}

const toLightboxImages = (images: MediaImage[], title: string, kind: string): LightboxImage[] =>
  images.map((image, index) => ({
    src: image.url,
    alt: `${title} ${kind} ${index + 1}`,
    width: image.width,
    height: image.height,
  }))

export const MediaImageGallery = ({
  backdrops,
  posters,
  title,
  className,
  posterLabel = 'Posters',
  backdropLabel = 'Backdrops',
  posterAspect = 'portrait',
  backdropAspect = 'landscape',
  preferBackdrops = false,
}: MediaImageGalleryProps) => {
  const hasBackdrops = backdrops.length > 0
  const hasPosters = posters.length > 0
  const defaultTab: GalleryTab = preferBackdrops
    ? hasBackdrops
      ? 'backdrops'
      : 'posters'
    : hasPosters
      ? 'posters'
      : 'backdrops'
  const [tab, setTab] = useState<GalleryTab>(defaultTab)
  const [expanded, setExpanded] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<LightboxImage[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const activeSource = tab === 'posters' ? posters : backdrops
  const previewLimit = PREVIEW_LIMIT[tab]
  const hiddenCount = Math.max(0, activeSource.length - previewLimit)
  const canToggle = hiddenCount > 0

  const openLightbox = (images: MediaImage[], index: number, kind: string) => {
    setLightboxImages(toLightboxImages(images, title, kind))
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const handleTabChange = (value: string | number | null) => {
    if (value === 'posters' || value === 'backdrops') {
      setTab(value)
      setExpanded(false)
    }
  }

  const portraitItemClass =
    'group relative aspect-2/3 w-full cursor-pointer overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/8 transition-transform duration-300 hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-ring'
  const landscapeItemClass =
    'group relative aspect-video w-full cursor-pointer overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/8 transition-transform duration-300 hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-ring'

  if (!hasBackdrops && !hasPosters) return null

  return (
    <div className={cn('min-w-0', className)}>
      <Tabs value={tab} onValueChange={handleTabChange}>
        <div className="mb-3 flex min-w-0 flex-wrap items-center justify-between gap-3">
          <h2 className="text-foreground text-lg font-semibold">Gallery</h2>
          <TabsList className="shrink-0 p-0.5">
            <TabsIndicator />
            {preferBackdrops ? (
              <>
                {hasBackdrops && (
                  <TabsTab value="backdrops" className="h-8 px-2.5 text-xs">
                    {backdropLabel}
                    <span className="text-muted-foreground tabular-nums">{backdrops.length}</span>
                  </TabsTab>
                )}
                {hasPosters && (
                  <TabsTab value="posters" className="h-8 px-2.5 text-xs">
                    {posterLabel}
                    <span className="text-muted-foreground tabular-nums">{posters.length}</span>
                  </TabsTab>
                )}
              </>
            ) : (
              <>
                {hasPosters && (
                  <TabsTab value="posters" className="h-8 px-2.5 text-xs">
                    {posterLabel}
                    <span className="text-muted-foreground tabular-nums">{posters.length}</span>
                  </TabsTab>
                )}
                {hasBackdrops && (
                  <TabsTab value="backdrops" className="h-8 px-2.5 text-xs">
                    {backdropLabel}
                    <span className="text-muted-foreground tabular-nums">{backdrops.length}</span>
                  </TabsTab>
                )}
              </>
            )}
          </TabsList>
        </div>

        <div className="min-w-0">
          {tab === 'posters' && hasPosters ? (
            <div className="flex flex-col gap-3">
              <GalleryGrid
                images={posters}
                title={title}
                kind="poster"
                previewLimit={previewLimit}
                expanded={expanded}
                gridClassName={
                  posterAspect === 'landscape' ? 'grid grid-cols-2 gap-2' : 'grid grid-cols-3 gap-2'
                }
                itemClassName={
                  posterAspect === 'landscape' ? landscapeItemClass : portraitItemClass
                }
                onOpen={(index) => openLightbox(posters, index, posterLabel.toLowerCase())}
              />

              {canToggle && !expanded && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mx-auto"
                  onClick={() => setExpanded(true)}
                >
                  Show all ({hiddenCount} more)
                </Button>
              )}
            </div>
          ) : (
            hasBackdrops && (
              <div className="flex flex-col gap-3">
                <GalleryGrid
                  images={backdrops}
                  title={title}
                  kind="backdrop"
                  previewLimit={previewLimit}
                  expanded={expanded}
                  gridClassName={
                    backdropAspect === 'portrait'
                      ? 'grid grid-cols-3 gap-2'
                      : 'grid grid-cols-2 gap-2'
                  }
                  itemClassName={
                    backdropAspect === 'portrait' ? portraitItemClass : landscapeItemClass
                  }
                  onOpen={(index) => openLightbox(backdrops, index, backdropLabel.toLowerCase())}
                />

                {canToggle && !expanded && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mx-auto"
                    onClick={() => setExpanded(true)}
                  >
                    Show all ({hiddenCount} more)
                  </Button>
                )}
              </div>
            )
          )}
        </div>
      </Tabs>

      <Lightbox
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        images={lightboxImages}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        label={`${title} gallery`}
      />
    </div>
  )
}
