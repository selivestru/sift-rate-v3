import { Skeleton } from '~/common/ui/Skeleton'

export const TvShowDetailSkeleton = () => {
  return (
    <div className="flex max-w-full min-w-0 flex-col overflow-x-clip">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:gap-5 sm:p-6">
        <Skeleton className="aspect-2/3 w-36 shrink-0 rounded-xl sm:w-48" />
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-8 p-3 pb-8 md:p-6 md:pb-10">
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="aspect-2/3 w-28 shrink-0 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    </div>
  )
}
