import { Skeleton } from '~/common/ui/Skeleton'

import { PostItemSkeleton } from './PostItemSkeleton'

export const PostDetailPageSkeleton = () => {
  return (
    <div className="divide-border divide-y" aria-hidden>
      <div className="mb-2 p-3">
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
      <PostItemSkeleton isParent />
      <div className="space-y-2 p-3">
        <div className="flex items-end gap-2">
          <Skeleton className="min-h-10 flex-1 rounded-md" />
          <Skeleton className="size-10 rounded-md" />
        </div>
      </div>
    </div>
  )
}
