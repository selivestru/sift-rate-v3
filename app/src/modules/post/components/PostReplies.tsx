import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { useIntersectionObserver } from '~/common/hooks/useIntersectionObserver'
import { EmptyState } from '~/common/ui/EmptyState'
import { ErrorState } from '~/common/ui/ErrorState'
import { Spinner } from '~/common/ui/Spinner'
import { cn } from '~/common/utils/cn'

import { useGetPostRepliesQuery } from '../hooks/useGetPostRepliesQuery'
import { PostItem } from './PostItem'
import { PostListSkeleton } from './PostListSkeleton'

interface PostRepliesProps {
  postId: string
}

export const PostReplies = ({ postId }: PostRepliesProps) => {
  return (
    <ErrorBoundary fallback={<ErrorState />}>
      <Suspense fallback={<PostListSkeleton />}>
        <PostRepliesList postId={postId} />
      </Suspense>
    </ErrorBoundary>
  )
}

const PostRepliesList = ({ postId }: PostRepliesProps) => {
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetPostRepliesQuery(postId)

  const replies = data.pages.flatMap((page) => page.data)

  const loadMoreRef = useIntersectionObserver(
    () => fetchNextPage(),
    hasNextPage && !isFetchingNextPage,
  )

  if (replies.length === 0) {
    return <EmptyState title="No answers yet" />
  }

  return (
    <div className="divide-border divide-y">
      {replies.map((reply) => (
        <PostItem key={reply.id} data={reply} />
      ))}

      <div ref={loadMoreRef} className={cn(isFetchingNextPage && 'py-5 text-center')}>
        {isFetchingNextPage && <Spinner className="inline-flex size-10" />}
      </div>
    </div>
  )
}
