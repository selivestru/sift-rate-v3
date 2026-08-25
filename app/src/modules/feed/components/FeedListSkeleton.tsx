import { FeedReviewCardSkeleton } from './FeedReviewCardSkeleton'

export const FeedListSkeleton = () => {
  return (
    <div className="divide-border divide-y">
      {Array.from({ length: 5 }).map((_, index) => (
        // oxlint-disable-next-line react/no-array-index-key
        <FeedReviewCardSkeleton key={index} />
      ))}
    </div>
  )
}
