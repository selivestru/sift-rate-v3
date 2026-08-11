import { Skeleton } from '~/common/ui/Skeleton'

export const TrackSearchSkeleton = () => {
  return (
    <div className="bg-card border-border flex items-center gap-3 rounded-xl border p-2 pr-3">
      <Skeleton className="size-16 shrink-0 rounded-lg" />

      <div className="flex flex-1 flex-col gap-0.5">
        <Skeleton className="h-4 w-2/5 rounded-lg" />
        <Skeleton className="h-3 w-1/2 rounded-lg" />
      </div>

      <div className="flex items-center gap-2">
        <Skeleton className="hidden h-5 w-12 shrink-0 rounded-full sm:block" />
        <Skeleton className="h-4 w-10 rounded-lg" />
      </div>
    </div>
  )
}
