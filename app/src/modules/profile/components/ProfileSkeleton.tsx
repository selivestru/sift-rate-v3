import { Skeleton } from '~/common/ui/Skeleton'

export const ProfileSkeleton = () => {
  return (
    <div className="divide-border flex flex-col divide-y" aria-hidden>
      <div>
        <div className="h-70 max-md:h-50 md:overflow-hidden md:rounded-t-2xl">
          <Skeleton className="size-full rounded-none" />
        </div>

        <div className="relative px-6 pt-0 pb-6 max-md:px-4">
          <div className="-mt-16 flex items-end gap-5 max-md:-mt-12 max-md:gap-4">
            <Skeleton className="ring-card size-32 rounded-full ring-4 max-md:size-24" />

            <div className="flex flex-1 flex-col gap-2 pb-1">
              <Skeleton className="h-7 w-48 max-w-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="border-b-border border-b p-4">
          <Skeleton className="h-5 w-28" />
        </div>

        <div className="grid grid-cols-3 gap-3 p-4 max-md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              // oxlint-disable-next-line react/no-array-index-key
              key={index}
              className="bg-card border-border flex items-center gap-3 rounded-lg border px-3 py-2.5"
            >
              <Skeleton className="size-8 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="border-b-border border-b p-4">
          <Skeleton className="h-5 w-44" />
        </div>

        <div className="flex h-56 items-end gap-1.5 p-4 max-md:h-48">
          {Array.from({ length: 10 }).map((_, index) => (
            // oxlint-disable-next-line react/no-array-index-key
            <div key={index} className="flex h-full flex-1 flex-col items-center gap-2">
              <Skeleton className="w-full flex-1 rounded-t-sm" />
              <Skeleton className="h-3 w-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
