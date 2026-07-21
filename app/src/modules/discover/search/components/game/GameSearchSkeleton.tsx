import { Skeleton } from '~/common/ui/Skeleton'

export const GameSearchSkeleton = () => {
  return (
    <div className="relative aspect-3/4 w-full overflow-hidden rounded-2xl">
      <Skeleton className="absolute inset-0 rounded-2xl" />

      <div className="absolute top-2.5 right-2.5 left-2.5 flex items-center justify-between">
        <Skeleton className="bg-background/50 h-6 w-12 rounded-full" />
        <Skeleton className="bg-background/50 h-6 w-14 rounded-full" />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-3">
        <Skeleton className="bg-background/50 mb-0.5 h-4 w-4/5 rounded-lg" />
        <div className="flex flex-wrap gap-1">
          <Skeleton className="bg-background/50 h-5 w-14 rounded-full" />
          <Skeleton className="bg-background/50 h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="bg-background/50 h-3 w-2/3 rounded-lg" />
      </div>
    </div>
  )
}
