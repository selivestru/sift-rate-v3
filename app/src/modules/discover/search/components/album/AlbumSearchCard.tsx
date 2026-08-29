import { Link } from '@tanstack/react-router'
import { useIntlayer } from 'react-intlayer'

import { MEDIA_TYPES, mediaTypeMeta } from '~/common/constants/media-type'
import { Badge } from '~/common/ui/Badge'
import { cn } from '~/common/utils/cn'

import type { AlbumSearchItem } from '../../types/discover-search.types'

interface AlbumSearchCardProps {
  item: AlbumSearchItem
}

export const AlbumSearchCard = ({ item }: AlbumSearchCardProps) => {
  const { color, icon: MediaTypeIcon } = mediaTypeMeta[MEDIA_TYPES.ALBUM]
  const content = useIntlayer('discover-detail')

  return (
    <Link
      to="/discover/album/$externalId"
      params={{ externalId: item.id }}
      className={cn(
        'bg-card border-border group relative flex flex-col overflow-hidden rounded-xl border transition-colors duration-200',
        'hover:bg-accent',
        'focus-visible:ring-ring/40 focus-visible:ring-2 focus-visible:outline-none',
      )}
    >
      <div className="bg-muted relative aspect-square w-full overflow-hidden">
        {item.coverUrl ? (
          <img
            src={item.coverUrl}
            alt={item.title}
            className="size-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <MediaTypeIcon className="text-muted-foreground size-14" style={{ color }} />
          </div>
        )}

        {item.nbTracks !== null && (
          <Badge variant="blur" className="absolute top-2.5 right-2.5">
            {content.trackCount({ count: item.nbTracks })}
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-1 p-3">
        <h3 className="text-foreground line-clamp-1 text-sm leading-snug font-semibold">
          {item.title}
        </h3>
        <p className="text-muted-foreground line-clamp-1 text-xs font-medium">{item.artist}</p>
      </div>
    </Link>
  )
}
