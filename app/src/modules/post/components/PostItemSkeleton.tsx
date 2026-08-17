import { Skeleton } from '~/common/ui/Skeleton'

interface PostItemSkeletonProps {
  isParent?: boolean
}

export const PostItemSkeleton = ({ isParent = false }: PostItemSkeletonProps) => {
  const content = (
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-4 w-full rounded-md" />
      <Skeleton className="h-4 w-5/6 rounded-md" />
    </div>
  )

  const actions = (
    <div className="flex w-fit items-center gap-1">
      <Skeleton className="h-8 w-16 rounded-full" />
      <Skeleton className="h-8 w-14 rounded-full" />
    </div>
  )

  if (isParent) {
    return (
      <article aria-hidden className="flex flex-col gap-2 p-2 pb-2! sm:gap-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-3.5 w-20 rounded-md" />
            <Skeleton className="h-3.5 w-20 rounded-md" />
          </div>
        </div>
        {content}
        {actions}
      </article>
    )
  }

  return (
    <article
      aria-hidden
      className="relative grid grid-cols-[auto_1fr] gap-2 p-2 pb-2! sm:gap-3 sm:p-4"
    >
      <Skeleton className="size-10 rounded-full" />

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-3.5 w-20 rounded-md" />
          <Skeleton className="h-3.5 w-20 rounded-md" />
        </div>

        {content}
        {actions}
      </div>
    </article>
  )
}
