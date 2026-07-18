import { StarIcon } from 'lucide-react'

import { cn } from '../utils/cn'

interface RatingBadgeProps {
  rating: number
  className?: string
}

export const RatingBadge = ({ rating, className }: RatingBadgeProps) => {
  return (
    <div
      className={cn(
        'border-rating/30 bg-rating/10 shadow-rating/40 z-px flex items-center gap-1 rounded-full border px-2 py-0.5 backdrop-blur-xs',
        className,
      )}
    >
      <StarIcon className="fill-rating text-rating size-4.5" />
      <span className="text-rating text-base font-bold tabular-nums">{rating}</span>
    </div>
  )
}
