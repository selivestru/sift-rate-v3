import { Skeleton } from '~/common/ui/Skeleton'

export const AlbumDetailSkeleton = () => {
  return (
    <div className="flex max-w-full min-w-0 flex-col overflow-x-clip">
      <div className="relative min-h-64 overflow-hidden rounded-t-2xl sm:min-h-72">
        <Skeleton className="absolute inset-0 scale-105 rounded-none" />

        <div className="relative z-10 flex min-h-72 flex-col justify-end p-4 sm:min-h-80 sm:p-5">
          <div className="bg-card ring-border flex min-w-0 gap-3 rounded-2xl p-3 shadow-sm ring-1 sm:gap-4 sm:p-3.5">
            <Skeleton className="size-32 shrink-0 rounded-xl sm:size-48" />

            <div className="flex min-w-0 flex-1 flex-col justify-end gap-1.5 py-0.5">
              <Skeleton className="h-3 w-12 rounded-lg" />
              <Skeleton className="h-6 w-4/5 rounded-lg sm:h-7" />
              <Skeleton className="h-4 w-1/2 rounded-lg" />
              <Skeleton className="h-3.5 w-2/5 rounded-lg" />
              <Skeleton className="h-3 w-1/3 rounded-lg" />

              <div className="mt-1 flex flex-wrap gap-1">
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>

              <div className="mt-1.5 flex flex-wrap gap-2">
                <Skeleton className="h-9 w-18 rounded-xl" />
                <Skeleton className="h-9 w-20 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-8 p-3 pb-8 md:p-6 md:pb-10">
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-20 rounded-lg" />
            <Skeleton className="h-4 w-8 rounded-lg" />
          </div>

          <div className="flex flex-col gap-2">
            {Array.from({ length: 7 }, (_, index) => (
              <div
                key={index}
                className="bg-card ring-border flex min-h-14 items-center gap-3 rounded-2xl p-2 pr-3 ring-1"
              >
                <Skeleton className="size-10 shrink-0 rounded-xl sm:size-11" />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <Skeleton className="h-3.5 w-2/5 rounded-lg" />
                  <Skeleton className="h-3 w-12 rounded-lg" />
                </div>
                <Skeleton className="h-3 w-10 shrink-0 rounded-lg" />
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <Skeleton className="h-6 w-20 rounded-lg" />
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <li
                key={index}
                className="bg-card ring-border flex items-center gap-3 rounded-xl p-2.5 ring-1"
              >
                <Skeleton className="size-11 shrink-0 rounded-full" />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <Skeleton className="h-3.5 w-2/5 rounded-lg" />
                  <Skeleton className="h-3 w-1/4 rounded-lg" />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="min-w-0">
          <Skeleton className="mb-3 h-6 w-36 rounded-lg" />
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="flex w-36 shrink-0 flex-col gap-2 sm:w-40">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-3.5 w-4/5 rounded-lg" />
                <Skeleton className="h-3 w-1/2 rounded-lg" />
              </div>
            ))}
          </div>
        </section>

        <section className="min-w-0">
          <Skeleton className="mb-3 h-6 w-40 rounded-lg" />
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="flex w-36 shrink-0 flex-col gap-2 sm:w-40">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-3.5 w-4/5 rounded-lg" />
                <Skeleton className="h-3 w-1/2 rounded-lg" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
