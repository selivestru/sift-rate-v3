import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import type { FollowListType } from '~/common/constants/queries-keys'
import { useDisclosure } from '~/common/hooks/useDisclosure'
import { useIntersectionObserver } from '~/common/hooks/useIntersectionObserver'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/common/ui/Dialog'
import { EmptyState } from '~/common/ui/EmptyState'
import { ErrorState } from '~/common/ui/ErrorState'
import { Skeleton } from '~/common/ui/Skeleton'
import { Spinner } from '~/common/ui/Spinner'
import { cn } from '~/common/utils/cn'

import { useGetFollowListQuery } from '../hooks/useGetFollowListQuery'
import { FollowUserItem } from './FollowUserItem'

interface FollowsDialogProps {
  username: string
  type: FollowListType
  children: ({ open }: { open: () => void }) => React.ReactNode
}

export const FollowsDialog = ({ username, type, children }: FollowsDialogProps) => {
  const { opened, open, close } = useDisclosure()
  const title = type === 'followers' ? 'Followers' : 'Following'

  return (
    <>
      {children({ open })}
      <Dialog open={opened} onOpenChange={close}>
        <DialogContent
          showCloseButton
          className="flex h-[min(52rem,92dvh)] max-h-[min(52rem,92dvh)] flex-col gap-4 sm:max-w-md"
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <ErrorBoundary fallback={<ErrorState />}>
            <Suspense fallback={<FollowListSkeleton />}>
              <FollowList username={username} type={type} />
            </Suspense>
          </ErrorBoundary>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface FollowListProps {
  username: string
  type: FollowListType
}

const FollowList = ({ username, type }: FollowListProps) => {
  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetFollowListQuery(username, type)

  const users = data.pages.flatMap((page) => page.data)
  const isEmpty = !isFetching && users.length === 0

  const loadMoreRef = useIntersectionObserver(
    () => fetchNextPage(),
    hasNextPage && !isFetchingNextPage,
  )

  if (isEmpty) {
    return (
      <EmptyState
        title={type === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
        description={
          type === 'followers'
            ? 'When someone follows this profile, they will appear here.'
            : 'Accounts this profile follows will appear here.'
        }
      />
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-border divide-border flex-1 scrollbar-none divide-y overflow-y-auto rounded-xl border">
        {users.map((user) => (
          <FollowUserItem key={user.id} user={user} />
        ))}
      </div>

      <div ref={loadMoreRef} className={cn(isFetching && 'py-5 text-center')}>
        {isFetching && <Spinner className="inline-flex size-10" />}
      </div>
    </div>
  )
}

const FollowListSkeleton = () => {
  return (
    <div className="border-border divide-border divide-y overflow-hidden rounded-xl border">
      {Array.from({ length: 6 }).map((_, index) => (
        // oxlint-disable-next-line react/no-array-index-key
        <div key={index} className="flex items-center gap-3 px-4 py-4">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      ))}
    </div>
  )
}
