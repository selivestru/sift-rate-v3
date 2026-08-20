import { mediaTypeMeta } from '~/common/constants/media-type'
import { objectEntries } from '~/common/utils/typedObject'

import type { ReviewStats } from '../types/profile.types'

interface UserStatsSectionProps {
  reviewStats: ReviewStats
}

export const UserStatsSection = ({ reviewStats }: UserStatsSectionProps) => {
  const entries = objectEntries(reviewStats.byMediaType)

  return (
    <section>
      <h2 className="border-b-border border-b p-4 text-lg font-semibold tracking-tight">
        Reviews
        <span className="text-muted-foreground ml-2 text-base font-normal tabular-nums">
          {reviewStats.total}
        </span>
      </h2>

      <div className="grid grid-cols-3 gap-3 p-4 max-md:grid-cols-2">
        {entries.map(([type, count]) => {
          const meta = mediaTypeMeta[type]
          const Icon = meta.icon

          return (
            <div
              key={type}
              className="bg-card border-border flex items-center gap-3 rounded-lg border px-3 py-2.5"
            >
              <div
                className="flex size-8 shrink-0 items-center justify-center rounded-md"
                style={{ backgroundColor: `color-mix(in oklab, ${meta.color} 15%, transparent)` }}
              >
                <Icon className="size-4" style={{ color: meta.color }} />
              </div>
              <div className="flex-1">
                <p className="text-sm leading-tight font-medium">{meta.label}</p>
                <p className="text-muted-foreground text-xs tabular-nums">{count}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
