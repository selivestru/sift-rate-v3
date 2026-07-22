import { Link } from '@tanstack/react-router'
import { ArrowDown, ArrowUp, ArrowUpRight, Trash2 } from 'reicon-react'

import { toastApiError } from '~/common/api'
import { MEDIA_TYPES, mediaDetailRouteByType, mediaTypeMeta } from '~/common/constants/media-type'
import { Button } from '~/common/ui/Button'
import { MediaTypeBadge } from '~/common/ui/MediaTypeBadge'
import { cn } from '~/common/utils/cn'

import { podiumMeta } from '../constants/podium'
import { useDeleteRankedItem } from '../hooks/useDeleteRankedItem'
import { useReorderRankedItem } from '../hooks/useReorderRankedItem'
import type { RankedListEntry } from '../types/ranked-list.types'

interface RankedListItemRowProps {
  listId: string
  item: RankedListEntry
  total: number
}

export const RankedListItemRow = ({ listId, item, total }: RankedListItemRowProps) => {
  const deleteMutation = useDeleteRankedItem()
  const reorderMutation = useReorderRankedItem()

  const { media, position } = item
  const TypeIcon = mediaTypeMeta[media.mediaType].icon
  const medal = position <= 3 ? podiumMeta[position as 1 | 2 | 3] : null

  const isMusic = media.mediaType === MEDIA_TYPES.TRACK || media.mediaType === MEDIA_TYPES.ALBUM

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({ listId, itemId: item.id })
    } catch (error) {
      await toastApiError(error)
    }
  }

  const handleMove = async (nextPosition: number) => {
    if (nextPosition < 1 || nextPosition > total) return

    try {
      await reorderMutation.mutateAsync({
        listId,
        itemId: item.id,
        position: nextPosition,
      })
    } catch (error) {
      await toastApiError(error)
    }
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3.5 rounded-2xl p-3 transition-all duration-300 hover:scale-[1.01]',
        !medal && 'bg-foreground/3 ring-foreground/6 ring-1',
      )}
      style={
        medal
          ? {
              background: `linear-gradient(105deg, ${medal.accentSoft} 0%, color-mix(in oklab, ${medal.accent} 6%, transparent) 42%, transparent 78%)`,
              boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${medal.accent} 35%, transparent)`,
            }
          : undefined
      }
    >
      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold tabular-nums',
          !medal && 'bg-foreground/6 text-muted-foreground',
        )}
        style={
          medal
            ? {
                backgroundColor: medal.accentSoft,
                color: medal.accent,
                boxShadow: `inset 0 0 0 1px ${medal.accent}`,
              }
            : undefined
        }
      >
        {position}
      </span>

      <div
        className={cn(
          'bg-muted relative shrink-0 overflow-hidden rounded-xl shadow-sm',
          isMusic ? 'size-20' : 'aspect-2/3 w-20',
        )}
      >
        {media.posterUrl ? (
          <img
            src={media.posterUrl}
            alt={media.title}
            className="size-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <TypeIcon className="text-muted-foreground size-5" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="text-foreground line-clamp-2 text-sm font-semibold tracking-tight">
          {media.title}
        </p>
        <MediaTypeBadge size="sm" mediaType={media.mediaType} />
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          isIconOnly
          size="sm"
          type="button"
          variant="outline"
          aria-label={`Move ${media.title} up`}
          isDisabled={position <= 1}
          onClick={() => handleMove(position - 1)}
        >
          <ArrowUp />
        </Button>
        <Button
          isIconOnly
          size="sm"
          type="button"
          variant="outline"
          aria-label={`Move ${media.title} down`}
          isDisabled={position >= total}
          onClick={() => handleMove(position + 1)}
        >
          <ArrowDown />
        </Button>
        <Button
          isIconOnly
          size="sm"
          variant="secondary"
          type="button"
          aria-label={`Open ${media.title}`}
          render={
            <Link
              to={mediaDetailRouteByType[media.mediaType]}
              params={{ externalId: media.externalId }}
            />
          }
        >
          <ArrowUpRight />
        </Button>
        <Button
          isIconOnly
          size="sm"
          type="button"
          variant="danger-soft"
          aria-label={`Remove ${media.title} from list`}
          onClick={handleDelete}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  )
}
