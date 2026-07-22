import { Pen, Trash2 } from 'reicon-react'

import { useDisclosure } from '~/common/hooks/useDisclosure'
import { Button } from '~/common/ui/Button'
import { cn } from '~/common/utils/cn'
import { listsSection } from '~/modules/library'
import { reviewVisibilityConfig } from '~/modules/review'

import type { RankedListItem } from '../types/ranked-list.types'
import { DeleteRankedListDialog } from './DeleteRankedListDialog'
import { RankedListDetailDialog } from './RankedListDetailDialog'
import { RankedListPodium } from './RankedListPodium'
import { UpsertRankedListDialog } from './UpsertRankedListDialog'

const listAccent = listsSection.color

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
          'bg-card group relative flex cursor-pointer flex-col gap-3 overflow-hidden rounded-3xl p-4 text-left',
          'ring-border/50 ring-1 transition-all duration-300 ease-out',
          'hover:-translate-y-0.5 hover:ring-2 hover:ring-primary/35',
          'active:translate-y-0 active:scale-[0.99]',
          'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
        )}
        style={{ ['--list-accent' as string]: listAccent }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-80"
          aria-hidden
          style={{
            background:
              'radial-gradient(ellipse 80% 90% at 20% 0%, color-mix(in oklab, var(--list-accent) 18%, transparent), transparent 70%)',
          }}
        />

        <div className="relative flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-1.5">
            <h2 className="text-foreground line-clamp-2 text-base font-semibold tracking-tight">
              {item.title}
            </h2>
            <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium"
                style={{
                  backgroundColor: `color-mix(in oklab, ${visibility.color} 14%, transparent)`,
                  color: visibility.color,
                }}
              >
                <VisibilityIcon className="size-3" />
                {visibility.label}
              </span>
              <span className="tabular-nums">
                {count} {count === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          <div
            className={cn(
              'flex shrink-0 items-center gap-1 transition-opacity duration-300 opacity-0',
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
                  <Pen />
                </Button>
              )}
            </UpsertRankedListDialog>

            <DeleteRankedListDialog listId={item.id} title={item.title}>
              {({ open }) => (
                <Button
                  type="button"
                  variant="danger-soft"
                  size="sm"
                  isIconOnly
                  aria-label={`Delete ${item.title}`}
                  onClick={(event) => {
                    event.stopPropagation()
                    open()
                  }}
                >
                  <Trash2 />
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
