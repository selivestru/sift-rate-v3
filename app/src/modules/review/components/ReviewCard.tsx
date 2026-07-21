import type { Review } from '../types/review.types'

interface ReviewCardProps {
  review: Review
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  return <div className="">{review.id}</div>
}
