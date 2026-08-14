import { m } from 'motion/react'
import { useState } from 'react'

import { useIntersectionObserver } from '~/common/hooks/useIntersectionObserver'
import { EmptyState } from '~/common/ui/EmptyState'
import { ErrorState } from '~/common/ui/ErrorState'
import { Spinner } from '~/common/ui/Spinner'
import { cn } from '~/common/utils/cn'
import { useAuthStore } from '~/modules/auth'

import { useGetFeedQuery } from '../hooks/useGetFeedQuery'
import type { FeedTabKey } from '../types/feed.types'
import { FeedRow } from './FeedRow'
import { FeedRowSkeletons } from './FeedRowSkeletons'
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

  const { data, isPending, isError, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetFeedQuery(feedTab)

  const items = data?.pages.flatMap((page) => page.data) ?? []
  const isEmpty = !isFetching && !isError && items.length === 0

  const loadMoreRef = useIntersectionObserver(
    () => fetchNextPage(),
    hasNextPage && !isFetchingNextPage,
  )

  return (
    <div className="divide-border border-border divide-y border-b">
      {!isAuthenticated && (
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

      {isPending && <FeedRowSkeletons />}

      {isError && <ErrorState />}

      {isEmpty && <EmptyState title="No activity yet" />}

      {!isFetching && !isError && items.length > 0 && (
        <>
          {items.map((item) => (
            <FeedRow key={item.id} data={item} />
          ))}
        </>
      )}

      <div ref={loadMoreRef} className={cn(isFetching && 'py-5 text-center')}>
        {!isPending && isFetching && <Spinner className="inline-flex size-10" />}
      </div>
    </div>
  )
}
