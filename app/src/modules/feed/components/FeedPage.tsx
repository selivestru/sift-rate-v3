import { m } from 'motion/react'
import { Suspense, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import type { FeedTabKey } from '~/common/constants/queries-keys'
import { useIntersectionObserver } from '~/common/hooks/useIntersectionObserver'
import { EmptyState } from '~/common/ui/EmptyState'
import { ErrorState } from '~/common/ui/ErrorState'
import { Spinner } from '~/common/ui/Spinner'
import { cn } from '~/common/utils/cn'
import { useAuthStore } from '~/modules/auth'
import { PostItem, PostListSkeleton, PostModals } from '~/modules/post'

import { useGetFeedQuery } from '../hooks/useGetFeedQuery'
import { PostComposer } from './PostComposer'

const tabs: Array<{ title: string; tab: FeedTabKey }> = [
  {
    title: 'Latest',
    tab: 'ALL',
  },
  {
    title: 'Following',
    tab: 'FOLLOWING',
  },
]

export const FeedPage = () => {
  const [feedTab, setFeedTab] = useState<FeedTabKey>('ALL')

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <div className="divide-border border-border divide-y border-b">
      {isAuthenticated && (
        <>
          <nav aria-label="Feed" className="grid grid-cols-2">
            {tabs.map(({ title, tab }) => {
              const isActive = tab === feedTab
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFeedTab(tab)}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'relative flex h-13 hover:bg-muted/35 items-center justify-center text-sm font-medium outline-none transition-colors duration-300',
                    'focus-visible:ring-ring/40 focus-visible:ring-2 focus-visible:ring-inset',
                    isActive
                      ? 'text-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {title}
                  {isActive && (
                    <m.span
                      layoutId="feed-tab-indicator"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                      className="bg-primary absolute inset-x-0 bottom-0 mx-auto h-1 w-14 rounded-full"
                    />
                  )}
                </button>
              )
            })}
          </nav>

          <PostComposer />
        </>
      )}

      <ErrorBoundary fallback={<ErrorState />}>
        <Suspense fallback={<PostListSkeleton />}>
          <FeedList tab={feedTab} />
        </Suspense>
      </ErrorBoundary>

      <PostModals />
    </div>
  )
}

const FeedList = ({ tab }: { tab: FeedTabKey }) => {
  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetFeedQuery(tab)

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
    <>
      {items.map((item) => (
        <PostItem key={item.id} data={item} />
      ))}

      <div ref={loadMoreRef} className={cn(isFetching && 'py-5 text-center')}>
        {isFetching && <Spinner className="inline-flex size-10" />}
      </div>
    </>
  )
}
