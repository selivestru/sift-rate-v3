import { Skeleton } from '~/common/ui/Skeleton'

export const AlbumDetailSkeleton = () => {
  return (
    <div className="flex max-w-full min-w-0 flex-col overflow-x-clip">
      <div className="relative min-h-64 p-4 sm:min-h-72 sm:p-5">
        <Skeleton className="h-40 w-full rounded-2xl sm:h-48" />
      </div>

      <div className="flex min-w-0 flex-col gap-8 p-3 pb-8 md:p-6 md:pb-10">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-24" />
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-14 w-full rounded-2xl" />
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Skeleton className="aspect-square rounded-xl" />
            <Skeleton className="aspect-square rounded-xl" />
            <Skeleton className="aspect-square rounded-xl" />
            <Skeleton className="aspect-square rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
