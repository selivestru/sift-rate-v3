import { useIntlayer } from 'react-intlayer'
import { Plus } from 'reicon-react'

import { Button } from '~/common/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/common/ui/Dialog'

import type { RankedListItem } from '../types/ranked-list.types'
import { AddRankedItemDialog } from './AddRankedItemDialog'
import { RankedListItemRow } from './RankedListItemRow'

interface RankedListDetailDialogProps {
  list: RankedListItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const RankedListDetailDialog = ({
  list,
  open,
  onOpenChange,
}: RankedListDetailDialogProps) => {
  const content = useIntlayer('ranked-list-detail-dialog')
  const sortedItems = list.items.sort((a, b) => a.position - b.position)

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onOpenChange(false)}>
      <DialogContent
        showCloseButton
        className="flex h-[min(52rem,92dvh)] max-h-[min(52rem,92dvh)] flex-col gap-4 pt-4 sm:max-w-xl"
      >
        <DialogHeader className="pr-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <DialogTitle className="text-lg">{list.title}</DialogTitle>
              <DialogDescription className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground text-xs tabular-nums">
                  {content.rankedCount({ count: sortedItems.length })}
                </span>
              </DialogDescription>
            </div>

            <AddRankedItemDialog list={list}>
              {({ open: openAdd }) => (
                <Button type="button" size="sm" startIcon={<Plus />} onClick={openAdd}>
                  {content.add.value}
                </Button>
              )}
            </AddRankedItemDialog>
          </div>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 scrollbar-none flex-col gap-2 overflow-y-auto p-1">
          {sortedItems.length === 0 ? (
            <div className="bg-muted ring-border flex flex-col items-center gap-3 rounded-2xl px-4 py-12 text-center ring-1">
              <p className="text-foreground text-sm font-medium">{content.emptyPodium.value}</p>
              <p className="text-muted-foreground max-w-xs text-xs leading-relaxed">
                {content.emptyDescription.value}
              </p>
              <AddRankedItemDialog list={list}>
                {({ open: openAdd }) => (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    startIcon={<Plus />}
                    onClick={openAdd}
                  >
                    {content.addMedia.value}
                  </Button>
                )}
              </AddRankedItemDialog>
            </div>
          ) : (
            sortedItems.map((item) => (
              <RankedListItemRow
                key={item.id}
                listId={list.id}
                item={item}
                total={sortedItems.length}
              />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
