import { Skeleton } from '~/common/ui/Skeleton'

export const TrackSearchSkeleton = () => {
  return (
    <div className="bg-card ring-border/60 flex items-center gap-3 rounded-xl p-2 pr-3 ring-1">
      <Skeleton className="size-16 shrink-0 rounded-lg" />

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <Skeleton className="h-4 w-2/5 rounded-lg" />
        <Skeleton className="h-3 w-1/2 rounded-lg" />
      </div>

      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-12 shrink-0 rounded-lg" />
        <div className="flex gap-1">
          <Skeleton className="size-4 rounded-lg" />
          <Skeleton className="size-4 w-6.5 rounded-lg" />
        </div>
        <Skeleton className="size-8 rounded-full" />
      </div>
    </div>
  )
}
