import { Skeleton } from '~/common/ui/Skeleton'

const WEEKS = 52
const DAYS_PER_WEEK = 7

export const UserActivitySkeleton = () => {
  return (
    <section aria-hidden>
      <div className="border-b-border flex items-center justify-between gap-3 border-b p-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>

      <div className="overflow-hidden p-4">
        <div className="flex gap-1.5">
          {Array.from({ length: WEEKS }).map((_, week) => (
            // oxlint-disable-next-line react/no-array-index-key
            <div key={week} className="flex flex-col gap-1.5">
              {Array.from({ length: DAYS_PER_WEEK }).map((_day, dayIndex) => (
                // oxlint-disable-next-line react/no-array-index-key
                <Skeleton key={dayIndex} className="size-4 rounded-[3px]" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
