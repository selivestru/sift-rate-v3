import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { UserAdd } from 'reicon-react'

import { useIntersectionObserver } from '~/common/hooks/useIntersectionObserver'
import { EmptyState } from '~/common/ui/EmptyState'
import { ErrorState } from '~/common/ui/ErrorState'
import { Spinner } from '~/common/ui/Spinner'
import { cn } from '~/common/utils/cn'

import { useGetFollowRequestsQuery } from '../hooks/useGetFollowRequestsQuery'
import { FollowRequestItem } from './FollowRequestItem'
import { FollowRequestListSkeleton } from './FollowRequestListSkeleton'

export const FollowRequestsPage = () => {
  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6">
      <header className="flex items-center gap-3">
        <span className="bg-accent text-primary flex size-10 items-center justify-center rounded-lg">
          <UserAdd className="size-5" strokeWidth={1.75} aria-hidden />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">Follow requests</h1>
      </header>

      <ErrorBoundary fallback={<ErrorState />}>
        <Suspense fallback={<FollowRequestListSkeleton />}>
          <FollowRequestList />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

const FollowRequestList = () => {
  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetFollowRequestsQuery()

  const items = data.pages.flatMap((page) => page.data)
  const isEmpty = !isFetching && items.length === 0

  const loadMoreRef = useIntersectionObserver(
    () => fetchNextPage(),
    hasNextPage && !isFetchingNextPage,
  )

  if (isEmpty) {
    return (
      <EmptyState
        title="No follow requests"
        description="When someone requests to follow you, it will show up here."
      />
    )
  }

  return (
    <div>
      <div className="border-border divide-border divide-y overflow-hidden rounded-xl border">
        {items.map((item) => (
          <FollowRequestItem key={item.id} request={item} />
        ))}
      </div>

      <div ref={loadMoreRef} className={cn(isFetching && 'py-5 text-center')}>
        {isFetching && <Spinner className="inline-flex size-10" />}
      </div>
    </div>
  )
}
