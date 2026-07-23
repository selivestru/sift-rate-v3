import { Skeleton } from '~/common/ui/Skeleton'

export const GameSearchSkeleton = () => {
  return (
    <div className="bg-card border-border flex flex-col overflow-hidden rounded-xl border">
      <div className="relative aspect-3/4 w-full overflow-hidden">
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="absolute top-2.5 right-2.5 left-2.5 flex items-center justify-between">
          <Skeleton className="h-6 w-12 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5 p-3">
        <Skeleton className="h-4 w-4/5 rounded-lg" />
        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-3 w-2/3 rounded-lg" />
      </div>
    </div>
  )
}
