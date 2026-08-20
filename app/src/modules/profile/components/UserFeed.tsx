import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { useIntersectionObserver } from '~/common/hooks/useIntersectionObserver'
import { EmptyState } from '~/common/ui/EmptyState'
import { ErrorState } from '~/common/ui/ErrorState'
import { Spinner } from '~/common/ui/Spinner'
import { cn } from '~/common/utils/cn'
import { PostItem, PostListSkeleton } from '~/modules/post'

import { useGetFeedQuery } from '../hooks/useGetUserFeedQuery'

interface UserFeedProps {
  username: string
}

export const UserFeed = ({ username }: UserFeedProps) => {
  return (
    <ErrorBoundary
      fallback={
        <ErrorState
          title="Unable to load feed"
          description="We couldn't load this user's feed. Please try again later."
        />
      }
    >
      <Suspense fallback={<PostListSkeleton />}>
        <UserFeedList username={username} />
      </Suspense>
    </ErrorBoundary>
  )
}

const UserFeedList = ({ username }: UserFeedProps) => {
  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetFeedQuery(username)

  const items = data.pages.flatMap((page) => page.data)
  const isEmpty = !isFetching && items.length === 0

  const loadMoreRef = useIntersectionObserver(
    () => fetchNextPage(),
    hasNextPage && !isFetchingNextPage,
  )

  if (isEmpty) {
    return <EmptyState title="No activity yet" />
  }

  return (
    <section className="flex flex-col">
      <h2 className="border-b-border border-b p-4 text-lg font-semibold tracking-tight">Feed</h2>
      <div className="divide-border divide-y">
        {items.map((item) => (
          <PostItem key={item.id} data={item} />
        ))}
      </div>

      <div ref={loadMoreRef} className={cn(isFetching && 'py-5 text-center')}>
        {isFetching && <Spinner className="inline-flex size-10" />}
      </div>
    </section>
  )
}
