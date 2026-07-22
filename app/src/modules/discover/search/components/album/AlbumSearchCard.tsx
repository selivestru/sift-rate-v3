import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'reicon-react'

import { MEDIA_TYPES, mediaTypeMeta } from '~/common/constants/media-type'
import { Badge } from '~/common/ui/Badge'
import { Button } from '~/common/ui/Button'
import { cn } from '~/common/utils/cn'

import type { AlbumSearchItem } from '../../types/discover-search.types'

interface AlbumSearchCardProps {
  item: AlbumSearchItem
}

export const AlbumSearchCard = ({ item }: AlbumSearchCardProps) => {
  const { color, icon: MediaTypeIcon } = mediaTypeMeta[MEDIA_TYPES.ALBUM]

  return (
    <Link
      to="/discover/album/$externalId"
      params={{ externalId: item.id }}
      className={cn(
        'bg-card group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-400 ease-out',
        'hover:scale-[1.02] hover:shadow-lg active:scale-[0.99]',
        'ring-1 ring-(--card-accent)/8 hover:ring-(--card-accent)/25',
      )}
      style={{
        '--card-accent': color,
      }}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-t-2xl">
        <div className="bg-muted absolute inset-0 flex items-center justify-center">
          <MediaTypeIcon className="text-muted-foreground size-14" />
        </div>

        {item.coverUrl && (
          <img
            src={item.coverUrl}
            alt={item.title}
            className="relative size-full object-cover shadow-2xl transition-transform duration-500 ease-out group-hover:-translate-x-1 group-hover:scale-[1.03]"
            loading="lazy"
          />
        )}

        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center transition-transform duration-500 ease-out group-hover:translate-x-[44%]">
          <div
            className="group-hover:animate-vinyl-spin size-[94%] rounded-full opacity-0 shadow-2xl transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                'repeating-radial-gradient(circle at center, #0a0a0a 0 2px, #1c1c1c 2px 4px)',
            }}
          >
            <div
              className="absolute inset-0 m-auto size-1/3 rounded-full ring-2 ring-black/40"
              style={{ background: color }}
            />
          </div>
        </div>

        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-400 group-hover:opacity-100">
          <Button isIconOnly variant="secondary">
            <ArrowRight className="size-4.5" />
          </Button>
        </div>

        {item.nbTracks !== null && (
          <Badge variant="blur" className="z-px absolute top-2.5 right-2.5">
            {item.nbTracks === 1 ? '1 track' : `${item.nbTracks} tracks`}
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
