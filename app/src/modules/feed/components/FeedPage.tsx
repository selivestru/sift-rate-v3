import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useIntlayer } from 'react-intlayer'

import { useIntersectionObserver } from '~/common/hooks/useIntersectionObserver'
import { EmptyState } from '~/common/ui/EmptyState'
import { ErrorState } from '~/common/ui/ErrorState'
import { Spinner } from '~/common/ui/Spinner'
import { cn } from '~/common/utils/cn'

import { useGetFeedQuery } from '../hooks/useGetFeedQuery'
import { FeedListSkeleton } from './FeedListSkeleton'
import { FeedReviewCard } from './FeedReviewCard'

export const FeedPage = () => {
  return (
    <div className="divide-border divide-y">
      <ErrorBoundary fallback={<ErrorState />}>
        <Suspense fallback={<FeedListSkeleton />}>
          <FeedList />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

const FeedList = () => {
  const shared = useIntlayer('shared')
  const content = useIntlayer('feed')
  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetFeedQuery()

  const items = data.pages.flatMap((page) => page.data)
  const isEmpty = !isFetching && items.length === 0

  const loadMoreRef = useIntersectionObserver(
    () => fetchNextPage(),
    hasNextPage && !isFetchingNextPage,
  )

  if (isEmpty) {
    return (
      <EmptyState title={shared.noReviewsYet.value} description={content.emptyDescription.value} />
    )
  }

  return (
    <>
      {items.map((item) => (
        <FeedReviewCard key={item.id} item={item} />
      ))}

      <div ref={loadMoreRef} className={cn(isFetching && 'py-5 text-center')}>
        {isFetching && <Spinner className="inline-flex size-10" />}
      </div>
    </>
  )
}
