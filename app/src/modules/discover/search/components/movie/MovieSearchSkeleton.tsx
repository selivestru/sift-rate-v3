import { Skeleton } from '~/common/ui/Skeleton'

export const MovieSearchSkeleton = () => {
  return (
    <div className="bg-card border-border relative flex gap-4 overflow-hidden rounded-xl border">
      <Skeleton className="aspect-2/3 w-27.5 shrink-0 rounded-none sm:w-37.5" />

      <div className="relative flex flex-1 flex-col justify-center gap-2 py-4 pr-4">
        <Skeleton className="absolute top-3.5 right-3.5 h-7 w-12 rounded-full" />

        <Skeleton className="h-5 w-16 rounded-full" />

        <div className="flex items-center gap-2 pr-16">
          <Skeleton className="h-6 w-3/5 rounded-lg" />
          <Skeleton className="h-4 w-10 shrink-0 rounded-lg" />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3.5 w-full rounded-lg" />
          <Skeleton className="h-3.5 w-5/6 rounded-lg" />
          <Skeleton className="h-3.5 w-2/3 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
