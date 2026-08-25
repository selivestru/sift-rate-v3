import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { MessageText2 } from 'reicon-react'

import { useIntersectionObserver } from '~/common/hooks/useIntersectionObserver'
import type { MediaRef } from '~/common/types/media-ref.types'
import { Spinner } from '~/common/ui/Spinner'
import { cn } from '~/common/utils/cn'

import { useGetMediaReviews } from '../hooks/useGetMediaReviews'
import { MediaReviewCard } from './MediaReviewCard'
import { MediaReviewsError } from './MediaReviewsError'
import { MediaReviewsSkeleton } from './MediaReviewsSkeleton'

type MediaReviewsProps = MediaRef

export const MediaReviews = (props: MediaReviewsProps) => {
  return (
    <section aria-labelledby="media-reviews-heading" className="flex flex-col gap-3">
      <h2 id="media-reviews-heading" className="text-foreground text-lg font-semibold">
        Reviews
      </h2>
      <ErrorBoundary fallback={<MediaReviewsError />}>
        <Suspense fallback={<MediaReviewsSkeleton />}>
          <MediaReviewsList {...props} />
        </Suspense>
      </ErrorBoundary>
    </section>
  )
}

const MediaReviewsList = (props: MediaReviewsProps) => {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useGetMediaReviews(props)

  const items = data.pages.flatMap((page) => page.data)
  const isEmpty = !isFetching && items.length === 0

  const loadMoreRef = useIntersectionObserver(
    () => fetchNextPage(),
    hasNextPage && !isFetchingNextPage,
  )

  if (isEmpty) {
    return (
      <div className="bg-muted ring-border flex flex-col items-center gap-2 rounded-2xl px-4 py-10 text-center ring-1">
        <MessageText2 className="text-muted-foreground size-8 opacity-60" />
        <p className="text-foreground text-sm font-medium">No public reviews yet</p>
        <p className="text-muted-foreground max-w-sm text-xs">
          Be the first to share what this meant to you — rate it and write a public review.
        </p>
      </div>
    )
  }

  return (
    <>
      {data.pages.map((page) =>
        page.data.map((review) => <MediaReviewCard key={review.id} review={review} {...props} />),
      )}

      <div ref={loadMoreRef} className={cn(isFetching && 'py-5 text-center')}>
        {isFetching && <Spinner className="inline-flex size-10" />}
      </div>
    </>
  )
}
