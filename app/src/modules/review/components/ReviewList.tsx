import { Spinner } from '~/common/ui/Spinner'
import { cn } from '~/common/utils/cn'

import { useReviewList } from '../hooks/useReviewList'
import { ReviewCard } from './ReviewCard'
import { ReviewListEmpty } from './ReviewListEmpty'
import { ReviewListFilters } from './ReviewListFilters'
import { ReviewListHero } from './ReviewListHero'
import { ReviewListSkeleton } from './ReviewListSkeleton'

export const ReviewList = () => {
  const {
    query,
    setQuery,
    mediaType,
    setMediaType,
    rating,
    setRating,
    sort,
    setSort,
    reviews,
    stats,
    isStatsLoading,
    hasActiveFilters,
    isInitialLoading,
    isError,
    isListFetching,
    isFetchingNextPage,
    loadMoreRef,
  } = useReviewList()

  return (
    <div className="flex flex-col gap-4 p-4 sm:gap-5 sm:p-6">
      <ReviewListHero totalResults={stats?.total ?? 0} isLoading={isStatsLoading} />

      <ReviewListFilters
        query={query}
        onQueryChange={setQuery}
        mediaType={mediaType}
        onMediaTypeChange={setMediaType}
        rating={rating}
        onRatingChange={setRating}
        sort={sort}
        onSortChange={setSort}
        stats={stats}
      />

      {isInitialLoading && <ReviewListSkeleton />}

      {isError && !isInitialLoading && (
        <p role="alert" className="text-danger py-10 text-center text-sm">
          Couldn&apos;t load reviews.
        </p>
      )}

      {!isInitialLoading && !isError && reviews.length === 0 && (
        <ReviewListEmpty variant={hasActiveFilters ? 'search' : 'archive'} />
      )}

      {!isInitialLoading && !isError && reviews.length > 0 && (
        <div
          className={cn(
            'flex flex-col gap-3 transition-opacity duration-300',
            isListFetching && 'opacity-70',
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
