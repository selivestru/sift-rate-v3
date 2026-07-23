import { Skeleton } from '~/common/ui/Skeleton'

const SKELETON_KEYS = ['s1', 's2', 's3', 's4', 's5', 's6'] as const

export const RankingListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {SKELETON_KEYS.map((id) => (
        <div
          key={id}
          className="bg-card border-border flex flex-col gap-4 overflow-hidden rounded-xl border p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-5 w-2/3 rounded-lg" />
              <Skeleton className="h-3.5 w-1/3 rounded-lg" />
            </div>
            <Skeleton className="size-8 shrink-0 rounded-md" />
          </div>

          <div className="grid grid-cols-3 items-end justify-center gap-2">
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}
