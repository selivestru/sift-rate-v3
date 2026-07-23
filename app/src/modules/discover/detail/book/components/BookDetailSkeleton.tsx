import { Skeleton } from '~/common/ui/Skeleton'

export const BookDetailSkeleton = () => {
  return (
    <div className="flex max-w-full min-w-0 flex-col overflow-x-clip">
      <div className="relative min-w-0 overflow-hidden rounded-t-2xl">
        <div className="relative z-10 flex flex-col items-center px-5 pt-10 pb-7 sm:px-8 sm:pt-12 sm:pb-9">
          <Skeleton className="mb-7 aspect-2/3 w-38 rounded-sm sm:mb-8 sm:w-48" />

          <div className="flex w-full max-w-md min-w-0 flex-col items-center">
            <Skeleton className="mb-3 h-3 w-16 rounded-lg" />
            <Skeleton className="mb-2 h-8 w-4/5 max-w-md rounded-lg sm:h-9" />
            <Skeleton className="mb-4 h-4 w-1/2 max-w-xs rounded-lg" />
            <Skeleton className="h-4 w-40 rounded-lg" />

            <Skeleton className="my-5 h-px w-16 rounded-full" />

            <div className="mb-5 flex flex-wrap justify-center gap-2">
              <Skeleton className="h-10 w-20 rounded-xl" />
              <Skeleton className="h-10 w-22 rounded-xl" />
            </div>

            <div className="mb-5 flex flex-wrap items-start justify-center">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="flex min-w-0 flex-col items-center gap-1 px-3.5 sm:px-4"
                >
                  <Skeleton className="h-2.5 w-12 rounded-lg" />
                  <Skeleton className="h-4 w-14 rounded-lg" />
                </div>
              ))}
            </div>

            <Skeleton className="h-7 w-20 rounded-full" />

            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-8 p-3 pb-8 md:p-6 md:pb-10">
        <section className="min-w-0">
          <Skeleton className="mb-3 h-6 w-24 rounded-lg" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-full rounded-lg" />
            <Skeleton className="h-3.5 w-full rounded-lg" />
            <Skeleton className="h-3.5 w-full rounded-lg" />
            <Skeleton className="h-3.5 w-5/6 rounded-lg" />
            <Skeleton className="h-3.5 w-2/3 rounded-lg" />
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <Skeleton className="h-6 w-16 rounded-lg" />
          <div className="bg-card ring-border divide-border flex flex-col divide-y rounded-2xl ring-1">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 px-3.5 py-2.5 sm:px-4"
              >
                <Skeleton className="h-3 w-16 rounded-lg" />
                <Skeleton className="h-3.5 w-28 rounded-lg" />
              </div>
            ))}
          </div>
        </section>

        <section className="min-w-0">
          <Skeleton className="mb-3 h-6 w-16 rounded-lg" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-11 w-28 rounded-xl" />
            <Skeleton className="h-11 w-32 rounded-xl" />
            <Skeleton className="h-11 w-20 rounded-xl" />
          </div>
        </section>

        <section className="min-w-0">
          <Skeleton className="mb-3 h-6 w-36 rounded-lg" />
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
