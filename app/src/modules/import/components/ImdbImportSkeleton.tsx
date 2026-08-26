import { Skeleton } from '~/common/ui/Skeleton'

export const ImdbImportSkeleton = () => {
  return (
    <div className="border-border bg-card flex flex-col gap-5 rounded-xl border px-4 py-4 sm:px-5 sm:py-5">
      <div className="flex items-center gap-2.5">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-4 w-full max-w-md" />
      <Skeleton className="h-2 w-full rounded-full" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {['created', 'existing', 'type', 'not-found', 'invalid', 'errors'].map((key) => (
          <Skeleton key={key} className="h-16 rounded-lg" />
        ))}
      </div>
    </div>
  )
}
