import { Skeleton } from '~/common/ui/Skeleton'

export const MovieSearchSkeleton = () => {
  return (
    <div className="border-border/50 bg-surface/30 flex h-56.25 gap-4 rounded-2xl border p-3">
      <Skeleton className="aspect-2/3 w-25 shrink-0 rounded-2xl sm:w-37.5" />
      <div className="flex flex-1 flex-col justify-center gap-2">
        <Skeleton className="h-4 w-3/5 rounded-lg" />
        <Skeleton className="h-3 w-1/3 rounded-lg" />
        <Skeleton className="h-3 w-full rounded-lg" />
      </div>
    </div>
  )
}
