import type { MediaImage } from '../types/media-detail.types'

interface GalleryGridProps {
  images: MediaImage[]
  title: string
  kind: 'poster' | 'backdrop'
  previewLimit: number
  expanded: boolean
  gridClassName: string
  itemClassName: string
  onOpen: (index: number) => void
}

export const GalleryGrid = ({
  images,
  title,
  kind,
  previewLimit,
  expanded,
  gridClassName,
  itemClassName,
  onOpen,
}: GalleryGridProps) => {
  const previewImages = images.slice(0, previewLimit)

  return (
    <div className={gridClassName}>
      {(expanded ? images : previewImages).map((image, index) => (
        <button
          key={image.thumbUrl}
          type="button"
          onClick={() => onOpen(index)}
          className={itemClassName}
        >
          <img
            src={image.thumbUrl}
            alt={`${title} ${kind} ${index + 1}`}
            className="size-full object-cover"
            loading="lazy"
            width={image.width}
            height={image.height}
          />
        </button>
      ))}
    </div>
  )
}
