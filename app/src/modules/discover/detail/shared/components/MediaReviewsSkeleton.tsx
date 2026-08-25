import { MediaReviewCardSkeleton } from './MediaReviewCardSkeleton'

const SKELETON_KEYS = ['s1', 's2', 's3'] as const

export const MediaReviewsSkeleton = () => {
  return (
    <div className="flex flex-col gap-3" aria-hidden>
      {SKELETON_KEYS.map((key) => (
        <MediaReviewCardSkeleton key={key} />
      ))}
    </div>
  )
}
