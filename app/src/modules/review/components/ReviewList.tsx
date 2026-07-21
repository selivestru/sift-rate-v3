import { useIntersectionObserver } from '~/common/hooks/useIntersectionObserver'
import { Spinner } from '~/common/ui/Spinner'
import { cn } from '~/common/utils/cn'

import { useMyReviewsQuery } from '../hooks/useMyReviewsQuery'
import { ReviewCard } from './ReviewCard'

export const ReviewList = () => {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useMyReviewsQuery()

  const loadMoreRef = useIntersectionObserver(
    () => fetchNextPage(),
    hasNextPage && !isFetchingNextPage,
  )

  return (
    <div>
      {data?.pages.map((page) =>
        page.data.map((review) => <ReviewCard key={review.id} review={review} />),
      )}

      <div ref={loadMoreRef} className={cn(isFetching && 'py-5 text-center')}>
        {isFetching && <Spinner className="inline-flex size-10" />}
      </div>
    </div>
  )
}
