import { Skeleton } from '~/common/ui/Skeleton'

export const GameDetailSkeleton = () => {
  return (
    <div className="flex max-w-full min-w-0 flex-col overflow-x-clip">
      <div className="relative min-h-56 overflow-hidden rounded-t-2xl sm:min-h-72">
        <Skeleton className="absolute inset-0 rounded-none" />

        <div className="relative z-10 flex min-h-56 flex-col justify-end p-5 pb-16 sm:min-h-72 sm:p-6 sm:pb-20">
          <div className="flex max-w-xl min-w-0 flex-col gap-2.5">
            <Skeleton className="h-3 w-12 rounded-lg" />
            <Skeleton className="h-9 w-3/4 rounded-lg sm:h-10" />
            <Skeleton className="h-4 w-28 rounded-lg" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </div>

      <div className="relative z-10 -mt-12 flex min-w-0 flex-col gap-4 px-5 sm:-mt-14 sm:flex-row sm:items-start sm:gap-4 sm:px-6">
        <Skeleton className="aspect-2/3 w-32 shrink-0 rounded-xl sm:w-40" />

        <div className="bg-card/70 ring-border/50 min-w-0 flex-1 rounded-2xl p-3.5 ring-1 sm:p-4">
          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-10 w-20 rounded-3xl" />
              <Skeleton className="h-10 w-22 rounded-3xl" />
            </div>

            <div className="flex flex-col gap-1.5 sm:flex-row sm:gap-x-5">
              <div className="flex min-w-0 flex-col gap-1">
                <Skeleton className="h-3 w-16 rounded-lg" />
                <Skeleton className="h-4 w-32 rounded-lg" />
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <Skeleton className="h-3 w-16 rounded-lg" />
                <Skeleton className="h-4 w-28 rounded-lg" />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3.5 w-full rounded-lg" />
              <Skeleton className="h-3.5 w-full rounded-lg" />
              <Skeleton className="h-3.5 w-3/4 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-8 p-3 pb-8 md:p-6 md:pb-10">
        <section className="min-w-0">
          <Skeleton className="mb-3 h-6 w-28 rounded-lg" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="h-11 w-28 rounded-xl" />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <Skeleton className="h-6 w-24 rounded-lg" />
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="aspect-video rounded-xl" />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <Skeleton className="h-6 w-20 rounded-lg" />
          <Skeleton className="aspect-video w-full rounded-2xl" />
        </section>

        <section className="flex flex-col gap-3">
          <Skeleton className="h-6 w-16 rounded-lg" />
          <div className="bg-card/60 ring-border/50 divide-border/50 flex flex-col divide-y rounded-2xl ring-1">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 px-3.5 py-2.5 sm:px-4"
              >
                <Skeleton className="h-3 w-16 rounded-lg" />
                <Skeleton className="h-3.5 w-24 rounded-lg" />
              </div>
            ))}
          </div>
        </section>

        <section className="min-w-0">
          <Skeleton className="mb-3 h-6 w-40 rounded-lg" />
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="flex w-32 shrink-0 flex-col gap-2 sm:w-36">
                <Skeleton className="aspect-2/3 w-full rounded-xl" />
                <Skeleton className="h-3.5 w-4/5 rounded-lg" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
