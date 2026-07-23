import { Skeleton } from '~/common/ui/Skeleton'

const SKELETON_KEYS = ['s1', 's2', 's3', 's4', 's5', 's6'] as const

export const PlannedListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {SKELETON_KEYS.map((id) => (
        <div
          key={id}
          className="bg-card border-border flex flex-col overflow-hidden rounded-xl border"
        >
          <div className="relative aspect-2/3 w-full overflow-hidden">
            <Skeleton className="absolute inset-0 rounded-none" />
            <Skeleton className="absolute top-2.5 right-2.5 h-5 w-16 rounded-full" />

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 px-3 pt-16 pb-3">
              <Skeleton className="h-5 w-4/5 rounded-lg" />
              <Skeleton className="h-4 w-3/5 rounded-lg" />
            </div>
          </div>

          <div className="border-border grid h-11 grid-cols-2 border-t">
            <Skeleton className="h-full rounded-none" />
            <Skeleton className="h-full rounded-none" />
          </div>
        </div>
      ))}
    </div>
  )
}
