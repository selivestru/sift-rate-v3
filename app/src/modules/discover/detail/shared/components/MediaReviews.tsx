import { MessageText2 } from 'reicon-react'

import { useIntersectionObserver } from '~/common/hooks/useIntersectionObserver'
import type { MediaRef } from '~/common/types/media-ref.types'
import { Skeleton } from '~/common/ui/Skeleton'
import { Spinner } from '~/common/ui/Spinner'
import { cn } from '~/common/utils/cn'

import { useGetMediaReviews } from '../hooks/useGetMediaReviews'
import { MediaReviewCard } from './MediaReviewCard'

type MediaReviewsProps = MediaRef

export const MediaReviews = (props: MediaReviewsProps) => {
  const { data, fetchNextPage, hasNextPage, isLoading, isFetching, isFetchingNextPage, isError } =
    useGetMediaReviews(props)

  const loadMoreRef = useIntersectionObserver(
    () => fetchNextPage(),
    hasNextPage && !isFetchingNextPage,
  )

  return (
    <section aria-labelledby="media-reviews" className="flex flex-col gap-3">
      <h2 id="media-reviews-heading" className="text-foreground text-lg font-semibold">
        Reviews
      </h2>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              // oxlint-disable-next-line react/no-array-index-key
              key={index}
              className="bg-card border-border flex gap-3 rounded-xl border p-4"
            >
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <Skeleton className="h-3.5 w-28 rounded-lg" />
                    <Skeleton className="h-3 w-16 rounded-lg" />
                  </div>
                  <Skeleton className="h-6 w-12 shrink-0 rounded-full" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-3.5 w-full rounded-lg" />
                  <Skeleton className="h-3.5 w-5/6 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="bg-card border-border text-destructive rounded-2xl border px-4 py-6 text-center text-sm">
          Couldn&apos;t load reviews. Try again later.
        </div>
      )}

      {!isLoading && !isError && !data?.pages[0].data.length && (
        <div className="bg-muted ring-border flex flex-col items-center gap-2 rounded-2xl px-4 py-10 text-center ring-1">
          <MessageText2 className="text-muted-foreground size-8 opacity-60" />
          <p className="text-foreground text-sm font-medium">No public reviews yet</p>
          <p className="text-muted-foreground max-w-sm text-xs">
            Be the first to share what this meant to you — rate it and write a public review.
          </p>
        </div>
      )}

      {data?.pages.map((page) =>
        page.data.map((review) => <MediaReviewCard key={review.id} review={review} {...props} />),
      )}

      <div ref={loadMoreRef} className={cn(isFetching && 'py-5 text-center')}>
        {isFetching && <Spinner className="inline-flex size-10" />}
      </div>
    </section>
  )
}
