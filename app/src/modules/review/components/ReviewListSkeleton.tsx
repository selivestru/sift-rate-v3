import { Skeleton } from '~/common/ui/Skeleton'

const SKELETON_KEYS = ['r1', 'r2', 'r3', 'r4', 'r5'] as const

export const ReviewListSkeleton = () => {
  return (
    <div className="flex flex-col gap-3" aria-hidden>
      {SKELETON_KEYS.map((id) => (
        <div
          key={id}
          className="bg-card border-border relative flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-stretch sm:gap-4 sm:p-4"
        >
          <div className="absolute top-3 right-3 z-10 flex gap-1">
            <Skeleton className="size-9 rounded-md" />
            <Skeleton className="size-9 rounded-md" />
          </div>

          <Skeleton className="aspect-2/3 max-h-64 w-full shrink-0 rounded-lg sm:max-h-none sm:w-36 md:w-42" />

          <div className="flex flex-1 flex-col gap-2 sm:gap-2.5">
            <div className="flex flex-wrap gap-1.5">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>

            <Skeleton className="h-5 w-3/5 rounded-lg sm:h-6" />

            <div className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-6 w-12 shrink-0 rounded-full" />
              <Skeleton className="h-3.5 w-24 rounded-lg" />
            </div>

            <Skeleton className="h-16 w-full rounded-r-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}
