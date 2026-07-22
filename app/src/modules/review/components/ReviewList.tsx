import { useState } from 'react'
import { Search } from 'reicon-react'

import { useDebouncedValue } from '~/common/hooks/useDebouncedValue'
import { useIntersectionObserver } from '~/common/hooks/useIntersectionObserver'
import { Input } from '~/common/ui/Input'
import { Spinner } from '~/common/ui/Spinner'
import { cn } from '~/common/utils/cn'

import { useMyReviewsQuery } from '../hooks/useMyReviewsQuery'
import { ReviewCard } from './ReviewCard'
import { ReviewListEmpty } from './ReviewListEmpty'
import { ReviewListSkeleton } from './ReviewListSkeleton'

export const ReviewList = () => {
  const [query, setQuery] = useState('')
  const debouncedQ = useDebouncedValue(query, 300)

  const { data, fetchNextPage, hasNextPage, isPending, isFetching, isFetchingNextPage, isError } =
    useMyReviewsQuery({ q: debouncedQ })

  const reviews = data?.pages.flatMap((page) => page.data) ?? []
  const hasSearch = Boolean(debouncedQ.trim())

  const isInitialLoading = isPending || (isFetching && !isFetchingNextPage && !data)

  const loadMoreRef = useIntersectionObserver(
    () => fetchNextPage(),
    hasNextPage && !isFetchingNextPage,
  )

  return (
    <div className="flex flex-col gap-4 p-4 sm:gap-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Reviews</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Your ratings and notes, kept as a personal archive.
        </p>
      </div>

      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search your reviews"
        startIcon={<Search />}
        aria-label="Search reviews"
      />

      {isInitialLoading && <ReviewListSkeleton />}

      {isError && !isInitialLoading && (
        <p role="alert" className="text-danger py-10 text-center text-sm">
          Couldn&apos;t load reviews.
        </p>
      )}

      {!isInitialLoading && !isError && reviews.length === 0 && (
        <ReviewListEmpty variant={hasSearch ? 'search' : 'archive'} />
      )}

      {!isInitialLoading && !isError && reviews.length > 0 && (
        <div
          className={cn(
            'flex flex-col gap-3 transition-opacity duration-300',
            isFetching && !isFetchingNextPage && 'opacity-70',
          )}
        >
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      <div ref={loadMoreRef} className={cn(isFetchingNextPage && 'py-5 text-center')}>
        {isFetchingNextPage && <Spinner className="inline-flex size-10" />}
      </div>
    </div>
  )
}
