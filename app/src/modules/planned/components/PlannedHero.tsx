import { useIntlayer } from 'react-intlayer'

import { plannedNavItem } from '~/common/constants/navigation'
import { useNavLabels } from '~/common/i18n'
import { Skeleton } from '~/common/ui/Skeleton'
import { cn } from '~/common/utils/cn'

interface PlannedHeroProps {
  total: number | null
}

const QUEUE_TICKS = [
  { id: 't1', height: 'h-2', opacity: 0.4 },
  { id: 't2', height: 'h-2.5', opacity: 0.55 },
  { id: 't3', height: 'h-3', opacity: 0.7 },
  { id: 't4', height: 'h-3.5', opacity: 0.85 },
  { id: 't5', height: 'h-4', opacity: 1 },
] as const

export const PlannedHero = ({ total }: PlannedHeroProps) => {
  const content = useIntlayer('planned')
  const shared = useIntlayer('shared')
  const labels = useNavLabels()
  const { color, icon: PlannedIcon } = plannedNavItem
  const isLoading = total == null
  const isEmpty = total === 0

  return (
    <div
      className={cn(
        'relative isolate overflow-hidden rounded-2xl',
        'bg-card ring-1 ring-border',
        'px-5 py-6 sm:px-7 sm:py-8',
      )}
      style={{ ['--planned-accent' as string]: color }}
    >
      <PlannedIcon
        className="pointer-events-none absolute -right-6 -bottom-8 size-44 opacity-[0.06] sm:size-56"
        aria-hidden
        style={{ color }}
      />

      <div className="relative flex flex-col gap-8 sm:flex-row sm:justify-between sm:gap-10">
        <div className="flex flex-1 flex-col gap-3">
          <p className="text-muted-foreground text-[11px] font-medium tracking-[0.18em] uppercase">
            {shared.library.value}
          </p>

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {labels['/library/planned'].label}
            </h1>
            <p className="text-muted-foreground max-w-[36ch] text-sm leading-relaxed sm:text-[15px]">
              {content.heroDescription.value}
            </p>
          </div>
        </div>

        <div
          className="flex shrink-0 flex-col items-start gap-3 sm:items-end"
          aria-label={
            isLoading
              ? content.loadingQueueCount.value
              : content.queueCount({ count: String(total) })
          }
        >
          <div className="flex flex-col items-start gap-0.5 sm:items-end sm:text-right">
            {isLoading ? (
              <Skeleton className="h-12 w-16 rounded-xl sm:h-14 sm:w-20" />
            ) : (
              <p
                className={cn(
                  'text-5xl font-semibold tracking-tighter tabular-nums sm:text-6xl',
                  isEmpty && 'text-muted-foreground',
                )}
                style={!isEmpty ? { color } : undefined}
              >
                {total}
              </p>
            )}
            <p className="text-muted-foreground text-xs font-medium tracking-wide sm:text-sm">
              {content.inQueue.value}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-7 flex items-center gap-2 sm:mt-9" aria-hidden>
        <div className="bg-border h-px flex-1" />
        <div className="flex items-end gap-1.5 px-0.5">
          {QUEUE_TICKS.map((tick) => (
            <span
              key={tick.id}
              className={cn('w-1 rounded-full sm:w-1.5', tick.height)}
              style={{
                backgroundColor: color,
                opacity: tick.opacity,
                boxShadow: `0 0 10px color-mix(in oklab, ${color} 45%, transparent)`,
              }}
            />
          ))}
        </div>
        <div className="bg-border h-px flex-1" />
      </div>
    </div>
  )
}
