import { Link } from '@tanstack/react-router'
import { ArrowUpRightIcon, CalendarCheckIcon, Trash2Icon } from 'lucide-react'

import { toastApiError } from '~/common/api'
import { mediaDetailRouteByType, mediaTypeMeta } from '~/common/constants/media-type'
import { Button } from '~/common/ui/Button'
import { MediaTypeBadge } from '~/common/ui/MediaTypeBadge'
import { cn } from '~/common/utils/cn'
import { formatRelativeDate } from '~/common/utils/formatRelativeDate'

import { useDeletePlannedItem } from '../hook/useDeletePlannedItem'
import type { PlannedListItem } from '../types/planned.types'

interface PlannedMediaCardProps {
  item: PlannedListItem
}

export const PlannedMediaCard = ({ item }: PlannedMediaCardProps) => {
  const { media } = item
  const config = mediaTypeMeta[media.mediaType]
  const TypeIcon = config.icon
  const accent = config.color

  const deleteMutation = useDeletePlannedItem()

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(item.id)
    } catch (error) {
      await toastApiError(error)
    }
  }

  return (
    <div
      className={cn(
        'bg-card group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 ease-out',
        'ring-1 ring-(--card-accent)/15 hover:ring-2 hover:ring-(--card-accent)/55',
        'hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]',
        deleteMutation.isPending && 'pointer-events-none animate-pulse',
      )}
      style={{
        '--card-accent': accent,
      }}
    >
      <div className="relative aspect-2/3 w-full overflow-hidden">
        {media.posterUrl ? (
          <img
            src={media.posterUrl}
            alt={media.title}
            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="bg-muted flex size-full items-center justify-center">
            <TypeIcon className="size-10 text-(--card-accent)" />
          </div>
        )}

        <MediaTypeBadge
          alternateColor
          mediaType={media.mediaType}
          className="absolute top-2.5 right-2.5"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 via-black/50 to-transparent pt-16 pb-3">
          <div className="flex flex-col gap-1 px-3">
            <h3 className="line-clamp-2 text-lg font-bold tracking-tight">{media.title}</h3>
            <p className="text-muted-foreground flex items-center gap-1 text-[11px]">
              <CalendarCheckIcon className="size-3 shrink-0 opacity-80" />
              <span>Saved {formatRelativeDate(item.createdAt)}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <Button
          className="h-11 rounded-none border-none"
          variant="default"
          render={
            <Link
              to={mediaDetailRouteByType[media.mediaType]}
              params={{ externalId: media.externalId }}
            />
          }
          endIcon={<ArrowUpRightIcon />}
        >
          Open
        </Button>

        <Button
          className="h-11 rounded-none border-none"
          aria-label={`Delete ${media.title} from planned`}
          variant="danger-soft"
          onClick={handleDelete}
          startIcon={<Trash2Icon />}
          isLoading={deleteMutation.isPending}
        >
          Delete
        </Button>
      </div>
    </div>
  )
}
