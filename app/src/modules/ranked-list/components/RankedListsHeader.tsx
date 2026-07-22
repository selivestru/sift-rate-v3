import { PlusCircle2 } from 'reicon-react'

import { Button } from '~/common/ui/Button'
import { Skeleton } from '~/common/ui/Skeleton'
import { cn } from '~/common/utils/cn'
import { listsSection } from '~/modules/library'

import { UpsertRankedListDialog } from './UpsertRankedListDialog'

interface RankedListsHeaderProps {
  total: number | null
}

export const RankedListsHeader = ({ total }: RankedListsHeaderProps) => {
  const { color, icon: ListsIcon } = listsSection

  return (
    <div className="z-px relative flex flex-col gap-5">
      <div className="flex items-end justify-between gap-6">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className="flex size-9 items-center justify-center rounded-xl"
              style={{
                backgroundColor: `color-mix(in oklab, ${color} 14%, transparent)`,
                color,
              }}
            >
              <ListsIcon className="size-4" />
            </span>
            <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Library
            </span>
          </div>

          <h1 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
            Ranked lists
          </h1>

          <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
            Ordered rankings you build over time. Podium first, full rank when you open a list.
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-3">
          <div className="hidden flex-col items-end sm:flex">
            {total == null ? (
              <Skeleton className="size-12 rounded-lg" />
            ) : (
              <p
                className={cn(
                  'text-4xl font-semibold tracking-tighter tabular-nums sm:text-5xl',
                  total === 0 && 'text-muted-foreground/50',
                )}
                style={total > 0 ? { color } : undefined}
              >
                {total}
              </p>
            )}
            <p className="text-muted-foreground mt-0.5 text-xs font-medium">lists</p>
          </div>

          <UpsertRankedListDialog>
            {({ open }) => (
              <Button type="button" startIcon={<PlusCircle2 />} onClick={open}>
                New list
              </Button>
            )}
          </UpsertRankedListDialog>
        </div>
      </div>

      {total != null && (
        <p className="text-muted-foreground text-xs tabular-nums sm:hidden">{total} lists</p>
      )}
    </div>
  )
}
