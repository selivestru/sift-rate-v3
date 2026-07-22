import { PlusCircle2 } from 'reicon-react'

import { rankedListNavItem } from '~/common/constants/navigation'
import { Button } from '~/common/ui/Button'
import { Skeleton } from '~/common/ui/Skeleton'
import { cn } from '~/common/utils/cn'

import { PODIUM_RANKS, podiumMeta } from '../constants/podium'
import { UpsertRankedListDialog } from './UpsertRankedListDialog'

interface RankedListsHeroProps {
  total: number | null
}

const pedestalHeight: Record<(typeof PODIUM_RANKS)[number], string> = {
  1: 'h-14 sm:h-16',
  2: 'h-10 sm:h-12',
  3: 'h-8 sm:h-9',
}

export const RankedListsHero = ({ total }: RankedListsHeroProps) => {
  const { color, icon: ListsIcon } = rankedListNavItem
  const isLoading = total == null
  const isEmpty = total === 0

  return (
    <div
      className={cn(
        'relative isolate overflow-hidden rounded-4xl',
        'bg-card ring-1 ring-border/50',
        'px-5 py-6 sm:px-7 sm:py-8',
      )}
      style={{ ['--list-accent' as string]: color }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: [
            'radial-gradient(ellipse 95% 85% at 0% 0%, color-mix(in oklab, var(--list-accent) 22%, transparent), transparent 64%)',
            'radial-gradient(ellipse 65% 70% at 100% 100%, color-mix(in oklab, var(--list-accent) 14%, transparent), transparent 60%)',
            'radial-gradient(ellipse 40% 45% at 72% 18%, color-mix(in oklab, var(--list-accent) 10%, transparent), transparent 55%)',
          ].join(', '),
        }}
      />

      <ListsIcon
        className="pointer-events-none absolute -right-6 -bottom-8 size-44 opacity-[0.06] sm:size-56"
        aria-hidden
        style={{ color }}
      />

      <div className="relative flex flex-col gap-8 sm:flex-row sm:justify-between sm:gap-10">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <p className="text-muted-foreground text-[11px] font-medium tracking-[0.18em] uppercase">
            Library
          </p>

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Ranked lists</h1>
            <p className="text-muted-foreground max-w-[36ch] text-sm leading-relaxed sm:text-[15px]">
              Ordered boards of favorites. Podium first, full ranks inside each list.
            </p>
          </div>

          <UpsertRankedListDialog>
            {({ open }) => (
              <Button type="button" startIcon={<PlusCircle2 />} onClick={open} className="w-fit">
                New list
              </Button>
            )}
          </UpsertRankedListDialog>
        </div>

        <div
          className="flex shrink-0 flex-col items-start gap-3 sm:items-end"
          aria-label={isLoading ? 'Loading list count' : `${total} lists ordered`}
        >
          <div className="flex flex-col items-start gap-0.5 sm:items-end sm:text-right">
            {isLoading ? (
              <Skeleton className="h-12 w-16 rounded-xl sm:h-14 sm:w-20" />
            ) : (
              <p
                className={cn(
                  'text-5xl font-semibold tracking-tighter tabular-nums sm:text-6xl',
                  isEmpty && 'text-muted-foreground/45',
                )}
                style={!isEmpty ? { color } : undefined}
              >
                {total}
              </p>
            )}
            <p className="text-muted-foreground text-xs font-medium tracking-wide sm:text-sm">
              lists ordered
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-7 flex items-center gap-2 sm:mt-9" aria-hidden>
        <div className="bg-border/60 h-px flex-1" />
        <div className="flex items-end gap-1.5 px-0.5">
          {([2, 1, 3] as const).map((rank) => {
            const meta = podiumMeta[rank]
            const barHeight = rank === 1 ? 'h-2' : rank === 2 ? 'h-1.5' : 'h-1'

            return (
              <span
                key={rank}
                className={cn('w-6 rounded-full sm:w-8', barHeight)}
                style={{
                  backgroundColor: meta.accent,
                  boxShadow: `0 0 12px color-mix(in oklab, ${meta.accent} 50%, transparent)`,
                }}
              />
            )
          })}
        </div>
        <div className="bg-border/60 h-px flex-1" />
      </div>
    </div>
  )
}
