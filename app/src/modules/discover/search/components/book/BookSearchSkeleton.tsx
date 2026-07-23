import { Skeleton } from '~/common/ui/Skeleton'

export const BookSearchSkeleton = () => {
  return (
    <div className="bg-card border-border flex items-stretch overflow-hidden rounded-xl border">
      <Skeleton className="aspect-2/3 w-24 shrink-0 rounded-none sm:w-32" />

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-3">
        <Skeleton className="h-4 w-12 rounded-full" />
        <Skeleton className="h-5 w-4/5 rounded-lg" />
        <Skeleton className="h-5 w-1/2 rounded-lg" />
        <Skeleton className="h-3 w-2/5 rounded-lg" />

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <Skeleton className="h-3 w-10 rounded-lg" />
          <Skeleton className="h-3 w-14 rounded-lg" />
          <Skeleton className="h-3 w-12 rounded-lg" />
        </div>

        <div className="mt-0.5 flex flex-wrap gap-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>
    </div>
  )
}
