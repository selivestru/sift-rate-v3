import { Skeleton } from '~/common/ui/Skeleton'

export const AlbumSearchSkeleton = () => {
  return (
    <div className="bg-card ring-border/60 flex flex-col overflow-hidden rounded-2xl ring-1">
      <div className="relative aspect-square w-full overflow-hidden rounded-t-2xl">
        <Skeleton className="size-full rounded-none" />
        <Skeleton className="absolute top-2.5 right-2.5 h-5 w-16 rounded-full" />
      </div>

      <div className="flex flex-col gap-1 p-3">
        <Skeleton className="h-4 w-4/5 rounded-lg" />
        <Skeleton className="h-3 w-1/2 rounded-lg" />
      </div>
    </div>
  )
}
