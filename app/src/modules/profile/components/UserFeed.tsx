import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { useIntersectionObserver } from '~/common/hooks/useIntersectionObserver'
import { EmptyState } from '~/common/ui/EmptyState'
import { ErrorState } from '~/common/ui/ErrorState'
import { Spinner } from '~/common/ui/Spinner'
import { cn } from '~/common/utils/cn'
import { FeedListSkeleton, FeedReviewCard } from '~/modules/feed'

import { useGetUserFeedQuery } from '../hooks/useGetUserFeedQuery'

interface UserFeedProps {
  username: string
}

export const UserFeed = ({ username }: UserFeedProps) => {
  return (
    <ErrorBoundary
      fallback={
        <ErrorState
          title="Unable to load feed"
          description="We couldn't load this user's reviews. Please try again later."
        />
      }
    >
      <Suspense fallback={<FeedListSkeleton />}>
        <UserFeedList username={username} />
      </Suspense>
    </ErrorBoundary>
  )
}

const UserFeedList = ({ username }: UserFeedProps) => {
  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetUserFeedQuery(username)

  const items = data.pages.flatMap((page) => page.data)
  const isEmpty = !isFetching && items.length === 0

  const loadMoreRef = useIntersectionObserver(
    () => fetchNextPage(),
    hasNextPage && !isFetchingNextPage,
  )

  return (
    <section className="flex flex-col">
      <h2 className="border-b-border border-b p-4 text-lg font-semibold tracking-tight">Feed</h2>

      {isEmpty && (
        <EmptyState title="No reviews yet" description="Nothing rated or reviewed so far." />
      )}

      <div className="divide-border divide-y">
        {items.map((item) => (
          <FeedReviewCard key={item.id} item={item} />
        ))}
      </div>

      <div ref={loadMoreRef} className={cn(isFetching && 'py-5 text-center')}>
        {isFetching && <Spinner className="inline-flex size-10" />}
      </div>
    </section>
  )
}
