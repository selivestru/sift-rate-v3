import { Skeleton } from '~/common/ui/Skeleton'

export const NotificationListSkeleton = () => {
  return (
    <div className="border-border divide-border divide-y overflow-hidden rounded-xl border">
      {Array.from({ length: 6 }).map((_, index) => (
        // oxlint-disable-next-line react/no-array-index-key
        <div key={index} className="flex items-center gap-3 px-4 py-4">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  )
}
