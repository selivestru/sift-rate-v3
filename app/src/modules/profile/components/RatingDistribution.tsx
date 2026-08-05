import type { RatingDistribution as RatingDistributionType } from '../types/profile.types'

interface RatingDistributionProps {
  distribution: RatingDistributionType
}

const RATINGS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export const RatingDistribution = ({ distribution }: RatingDistributionProps) => {
  const maxCount = Math.max(...Object.values(distribution), 1)

  return (
    <section className="flex flex-col gap-8">
      <h2 className="text-lg font-semibold tracking-tight">Rating Distribution</h2>

      <div className="flex h-56 items-end gap-1.5 max-md:h-48">
        {RATINGS.map((rating) => {
          const count = distribution[rating] ?? 0
          const height = Math.max((count / maxCount) * 100, 2)

          return (
            <div key={rating} className="flex h-full flex-1 flex-col items-center gap-2">
              <div className="group hover:bg-primary/10 flex w-full flex-1 items-end rounded-t-sm">
                <div
                  className="bg-primary/60 group-hover:bg-primary pointer-coarse:bg-primary relative w-full rounded-t-sm transition-colors duration-200"
                  style={{ height: `${height}%` }}
                >
                  <div className="bg-popover border-border text-popover-foreground pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 hidden -translate-x-1/2 rounded-md border px-2 py-1 text-xs font-semibold tabular-nums shadow-sm group-hover:block pointer-coarse:block">
                    {count}
                  </div>
                </div>
              </div>

              <span className="text-muted-foreground text-[11px] font-medium tabular-nums">
                {rating}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
