import { Skeleton } from '~/common/ui/Skeleton'

export const GameDetailSkeleton = () => {
  return (
    <div className="flex max-w-full min-w-0 flex-col overflow-x-clip">
      <Skeleton className="min-h-56 w-full rounded-none rounded-t-2xl sm:min-h-72" />

      <div className="relative z-10 -mt-12 flex min-w-0 flex-col gap-4 px-5 sm:-mt-14 sm:flex-row sm:items-start sm:gap-4 sm:px-6">
        <Skeleton className="aspect-2/3 w-32 shrink-0 rounded-xl sm:w-40" />
        <Skeleton className="h-40 min-w-0 flex-1 rounded-2xl" />
      </div>

      <div className="flex min-w-0 flex-col gap-8 p-3 pb-8 md:p-6 md:pb-10">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-32" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-11 w-28 rounded-xl" />
            <Skeleton className="h-11 w-36 rounded-xl" />
            <Skeleton className="h-11 w-24 rounded-xl" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-24" />
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="aspect-video rounded-xl" />
            <Skeleton className="aspect-video rounded-xl" />
            <Skeleton className="aspect-video rounded-xl" />
            <Skeleton className="aspect-video rounded-xl" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
