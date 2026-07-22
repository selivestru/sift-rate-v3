import { PlusCircle2 } from 'reicon-react'

import { Button } from '~/common/ui/Button'

import { UpsertRankedListDialog } from './UpsertRankedListDialog'

export const RankingListEmpty = () => {
  return (
    <div className="bg-surface/50 border-border/50 flex flex-col items-center gap-4 rounded-2xl border px-4 py-14 text-center">
      <div className="flex flex-col gap-1.5">
        <p className="text-foreground font-semibold tracking-tight">No ranked lists yet</p>
        <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
          Build ordered rankings of media that shaped you. Start with a list, then fill the podium.
        </p>
      </div>

      <UpsertRankedListDialog>
        {({ open }) => (
          <Button type="button" variant="default" startIcon={<PlusCircle2 />} onClick={open}>
            Create list
          </Button>
        )}
      </UpsertRankedListDialog>
    </div>
  )
}
