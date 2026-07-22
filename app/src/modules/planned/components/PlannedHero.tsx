import { plannedNavItem } from '~/common/constants/navigation'
import { Skeleton } from '~/common/ui/Skeleton'
import { cn } from '~/common/utils/cn'

interface PlannedHeroProps {
  total: number | null
}

export const PlannedHero = ({ total }: PlannedHeroProps) => {
  const { color, icon: PlannedIcon } = plannedNavItem

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
              <PlannedIcon className="size-4" />
            </span>
            <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Library
            </span>
          </div>

          <h1 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
            Planned
          </h1>

          <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
            Media you saved for later. Your queue, ready when you are.
          </p>
        </div>

        <div className="hidden shrink-0 flex-col items-end sm:flex">
          {total === null ? (
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
          <p className="text-muted-foreground mt-0.5 text-xs font-medium">in queue</p>
        </div>
      </div>

      {total !== null && (
        <p className="text-muted-foreground text-xs tabular-nums sm:hidden">{total} in queue</p>
      )}
    </div>
  )
}
