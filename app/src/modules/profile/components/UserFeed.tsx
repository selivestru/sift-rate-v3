import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useIntlayer } from 'react-intlayer'

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
  const content = useIntlayer('user-feed')

  return (
    <ErrorBoundary
      fallback={
        <ErrorState
          title={content.unableToLoadFeed.value}
          description={content.feedLoadDescription.value}
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
  const content = useIntlayer('user-feed')
  const shared = useIntlayer('shared')
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
      <h2 className="border-b-border border-b p-4 text-lg font-semibold tracking-tight">
        {content.title.value}
      </h2>

      {isEmpty && (
        <EmptyState
          title={shared.noReviewsYet.value}
          description={content.noReviewsDescription.value}
        />
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
