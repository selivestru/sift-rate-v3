import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Bell } from 'reicon-react'

import { useIntersectionObserver } from '~/common/hooks/useIntersectionObserver'
import { Button } from '~/common/ui/Button'
import { EmptyState } from '~/common/ui/EmptyState'
import { ErrorState } from '~/common/ui/ErrorState'
import { Spinner } from '~/common/ui/Spinner'
import { cn } from '~/common/utils/cn'

import { useGetNotificationsQuery } from '../hooks/useGetNotificationsQuery'
import { useGetUnreadCountQuery } from '../hooks/useGetUnreadCountQuery'
import { useMarkAllReadMutation } from '../hooks/useMarkAllReadMutation'
import { NotificationItem } from './NotificationItem'
import { NotificationListSkeleton } from './NotificationListSkeleton'

export const NotificationsPage = () => {
  const { data } = useGetUnreadCountQuery()
  const { mutate: markAllRead, isPending } = useMarkAllReadMutation()
  const unreadCount = data?.count ?? 0

  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="bg-accent text-primary flex size-10 items-center justify-center rounded-lg">
            <Bell className="size-5" strokeWidth={1.75} aria-hidden />
          </span>
          <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" size="sm" isLoading={isPending} onClick={() => markAllRead()}>
            Mark all read
          </Button>
        )}
      </header>

      <ErrorBoundary fallback={<ErrorState />}>
        <Suspense fallback={<NotificationListSkeleton />}>
          <NotificationList />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

const NotificationList = () => {
  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetNotificationsQuery()

  const items = data.pages.flatMap((page) => page.data)
  const isEmpty = !isFetching && items.length === 0

  const loadMoreRef = useIntersectionObserver(
    () => fetchNextPage(),
    hasNextPage && !isFetchingNextPage,
  )

  if (isEmpty) {
    return <EmptyState title="No notifications yet" />
  }

  return (
    <div>
      <div className="border-border divide-border divide-y overflow-hidden rounded-xl border">
        {items.map((item) => (
          <NotificationItem key={item.id} notification={item} />
        ))}
      </div>

      <div ref={loadMoreRef} className={cn(isFetching && 'py-5 text-center')}>
        {isFetching && <Spinner className="inline-flex size-10" />}
      </div>
    </div>
  )
}
