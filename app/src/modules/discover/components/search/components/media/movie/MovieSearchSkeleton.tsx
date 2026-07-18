import { Skeleton } from '@heroui/react'

export const MovieSearchSkeleton = () => {
  return (
    <div className="border-border/50 bg-surface/30 flex items-center gap-3 rounded-2xl border p-3 sm:gap-4 sm:p-3.5">
      <Skeleton className="size-14 shrink-0 rounded-xl" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-2/3 rounded-md" />
        <Skeleton className="h-3 w-16 rounded-md" />
      </div>
    </div>
  )
}
