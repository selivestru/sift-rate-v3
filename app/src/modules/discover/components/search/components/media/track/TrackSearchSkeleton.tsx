import { Skeleton } from '@heroui/react'

export const TrackSearchSkeleton = () => {
  return (
    <div className="border-border/50 bg-surface/30 flex items-center gap-3 rounded-xl border px-3 py-2.5">
      <Skeleton className="size-10 shrink-0 rounded-lg" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Skeleton className="h-3.5 w-1/2 rounded-md" />
        <Skeleton className="h-3 w-1/3 rounded-md" />
      </div>
      <Skeleton className="h-3 w-8 shrink-0 rounded-md" />
    </div>
  )
}
