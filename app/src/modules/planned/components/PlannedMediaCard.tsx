import { Link } from '@tanstack/react-router'
import { ArrowUpRight, CalendarCheck, Trash6 } from 'reicon-react'

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
        'bg-card border-border group relative flex flex-col overflow-hidden rounded-xl border transition-colors duration-200',
        'hover:bg-accent',
        deleteMutation.isPending && 'pointer-events-none animate-pulse',
      )}
    >
      <div className="relative aspect-2/3 w-full overflow-hidden">
        {media.posterUrl ? (
          <img
            src={media.posterUrl}
            alt={media.title}
            className="size-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="bg-muted flex size-full items-center justify-center">
            <TypeIcon className="size-10" style={{ color: config.color }} />
          </div>
        )}

        <MediaTypeBadge
          alternateColor
          mediaType={media.mediaType}
          className="absolute top-2.5 right-2.5"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 via-black/50 to-transparent pt-16 pb-3">
          <div className="flex flex-col gap-1 px-3">
            <h3 className="line-clamp-2 text-lg font-semibold tracking-tight text-white">
              {media.title}
            </h3>
            <p className="flex items-center gap-1 text-[11px] text-white/80">
              <CalendarCheck className="size-3 shrink-0" />
              <span>Saved {formatRelativeDate(item.createdAt)}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="border-border grid grid-cols-2 border-t">
        <Button
          className="h-11 rounded-none rounded-bl-xl border-none"
          variant="secondary"
          render={
            <Link
              to={mediaDetailRouteByType[media.mediaType]}
              params={{ externalId: media.externalId }}
            />
          }
          endIcon={<ArrowUpRight />}
        >
          Open
        </Button>

        <Button
          className="h-11 rounded-none rounded-br-xl border-none"
          aria-label={`Delete ${media.title} from planned`}
          variant="destructive-soft"
          onClick={handleDelete}
          startIcon={<Trash6 weight="Filled" />}
          isLoading={deleteMutation.isPending}
        >
          Delete
        </Button>
      </div>
    </div>
  )
}
