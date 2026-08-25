import { Skeleton } from '~/common/ui/Skeleton'

export const MediaReviewCardSkeleton = () => {
  return (
    <div
      aria-hidden
      className="bg-card text-card-foreground border-border flex gap-3 rounded-xl border p-4"
    >
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <div className="flex flex-1 flex-col gap-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 10 }, (_, index) => (
                // oxlint-disable-next-line react/no-array-index-key
                <Skeleton key={index} className="size-5 rounded-sm" />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3.5 w-full rounded-md" />
          <Skeleton className="h-3.5 w-5/6 rounded-md" />
        </div>
      </div>
    </div>
  )
}
