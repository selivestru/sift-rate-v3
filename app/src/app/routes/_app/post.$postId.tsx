import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { ErrorState } from '~/common/ui/ErrorState'
import { PostDetailPage, PostDetailPageSkeleton } from '~/modules/post'

export const Route = createFileRoute('/_app/post/$postId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { postId } = Route.useParams()

  return (
    <ErrorBoundary fallback={<ErrorState />}>
      <Suspense fallback={<PostDetailPageSkeleton />}>
        <PostDetailPage postId={postId} />
      </Suspense>
    </ErrorBoundary>
  )
}
