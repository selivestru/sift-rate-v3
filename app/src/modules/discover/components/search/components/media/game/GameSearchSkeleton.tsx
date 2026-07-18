import { Skeleton } from '@heroui/react'

export const GameSearchSkeleton = () => {
  return (
    <div className="border-border/50 bg-surface/30 overflow-hidden rounded-2xl border">
      <Skeleton className="aspect-3/4 w-full rounded-none" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-4 w-4/5 rounded-md" />
        <Skeleton className="h-3 w-12 rounded-md" />
      </div>
    </div>
  )
}
