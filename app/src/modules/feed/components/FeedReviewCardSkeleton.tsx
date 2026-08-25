import { Skeleton } from '~/common/ui/Skeleton'

export const FeedReviewCardSkeleton = () => {
  return (
    <article aria-hidden className="flex gap-3 p-3 sm:gap-4 sm:p-4">
      <Skeleton className="size-10 shrink-0 rounded-full" />

      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-3.5 w-20 rounded-md" />
        </div>

        <div className="border-border flex gap-3 rounded-xl border p-3">
          <Skeleton className="aspect-2/3 w-20 shrink-0 rounded-lg sm:w-24" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-5 w-28 rounded-full" />
            <Skeleton className="h-5 w-40 rounded-md" />
          </div>
        </div>

        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-5/6 rounded-md" />
      </div>
    </article>
  )
}
