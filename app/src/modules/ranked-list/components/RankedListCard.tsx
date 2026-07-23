import { Pen, Trash6 } from 'reicon-react'

import { useDisclosure } from '~/common/hooks/useDisclosure'
import { Badge } from '~/common/ui/Badge'
import { Button } from '~/common/ui/Button'
import { cn } from '~/common/utils/cn'
import { reviewVisibilityConfig } from '~/modules/review'

import type { RankedListItem } from '../types/ranked-list.types'
import { DeleteRankedListDialog } from './DeleteRankedListDialog'
import { RankedListDetailDialog } from './RankedListDetailDialog'
import { RankedListPodium } from './RankedListPodium'
import { UpsertRankedListDialog } from './UpsertRankedListDialog'

interface RankedListCardProps {
  item: RankedListItem
}

export const RankedListCard = ({ item }: RankedListCardProps) => {
  const detail = useDisclosure()
  const visibility = reviewVisibilityConfig[item.visibility]
  const VisibilityIcon = visibility.icon
  const count = item.items.length

  return (
    <>
      <article
        role="button"
        tabIndex={0}
        onClick={detail.open}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            detail.open()
          }
        }}
        className={cn(
          'bg-card border-border group relative flex cursor-pointer flex-col gap-3 overflow-hidden rounded-xl border p-3 text-left',
          'transition-colors duration-200',
          'hover:bg-accent',
          'focus-visible:ring-ring/40 focus-visible:ring-2 focus-visible:outline-none',
        )}
      >
        <div className="relative flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-1.5">
            <h2 className="text-foreground line-clamp-2 text-base font-semibold tracking-tight">
              {item.title}
            </h2>
            <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
              <Badge size="sm" color={visibility.color} startIcon={<VisibilityIcon />}>
                {visibility.label}
              </Badge>
              <span className="tabular-nums">
                {count} {count === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          <div
            className={cn(
              'flex shrink-0 items-center gap-1 transition-opacity duration-200 opacity-0',
              'group-hover:opacity-100 group-focus-within:opacity-100',
            )}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <UpsertRankedListDialog list={item}>
              {({ open }) => (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  isIconOnly
                  aria-label={`Edit ${item.title}`}
                  onClick={(event) => {
                    event.stopPropagation()
                    open()
                  }}
                >
                  <Pen weight="Filled" />
                </Button>
              )}
            </UpsertRankedListDialog>

            <DeleteRankedListDialog listId={item.id} title={item.title}>
              {({ open }) => (
                <Button
                  type="button"
                  variant="destructive-soft"
                  size="sm"
                  isIconOnly
                  aria-label={`Delete ${item.title}`}
                  onClick={(event) => {
                    event.stopPropagation()
                    open()
                  }}
                >
                  <Trash6 weight="Filled" />
                </Button>
              )}
            </DeleteRankedListDialog>
          </div>
        </div>

        <RankedListPodium items={item.items} />
      </article>

      <RankedListDetailDialog
        list={item}
        open={detail.opened}
        onOpenChange={(next) => {
          if (!next) detail.close()
        }}
      />
    </>
  )
}
