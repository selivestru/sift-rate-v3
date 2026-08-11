import { Skeleton } from '~/common/ui/Skeleton'

export const FeedCardSkeleton = () => {
  return (
    <div className="flex gap-3 py-5 sm:gap-4 sm:py-6">
      <Skeleton className="size-11 shrink-0 rounded-full sm:size-12" />
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="flex gap-3">
          <Skeleton className="h-9 w-16 rounded-full" />
          <Skeleton className="h-9 w-16 rounded-full" />
        </div>
      </div>
    </div>
  )
}
