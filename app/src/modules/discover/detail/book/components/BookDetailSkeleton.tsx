import { Skeleton } from '~/common/ui/Skeleton'

export const BookDetailSkeleton = () => {
  return (
    <div className="flex max-w-full min-w-0 flex-col overflow-x-clip">
      <div className="flex flex-col items-center px-5 pt-10 pb-7 sm:px-8 sm:pt-12">
        <Skeleton className="mb-7 aspect-2/3 w-[9.5rem] rounded-sm sm:mb-8 sm:w-48" />
        <Skeleton className="mb-3 h-4 w-16" />
        <Skeleton className="mb-2 h-9 w-3/4 max-w-md" />
        <Skeleton className="mb-4 h-4 w-1/2 max-w-xs" />
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="flex min-w-0 flex-col gap-8 p-3 pb-8 md:p-6 md:pb-10">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    </div>
  )
}
