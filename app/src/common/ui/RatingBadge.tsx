import { Star } from 'reicon-react'

import { cn } from '../utils/cn'

interface RatingBadgeProps {
  rating: number
  size?: 'xs' | 'sm' | 'md'
  className?: string
}

export const RatingBadge = ({ rating, size = 'sm', className }: RatingBadgeProps) => {
  return (
    <div
      className={cn(
        'border-rating/30 bg-rating/25 shadow-rating/40 z-px flex items-center rounded-full border backdrop-blur-sm transition-backdrop gap-1 w-fit px-2 py-0.5',
        {
          'text-base': size === 'md',
          'text-sm': size === 'sm',
          'text-xs': size === 'xs',
        },
        className,
      )}
    >
      <Star
        weight="Filled"
        className={cn('text-rating', {
          'size-3.5': size === 'md',
          'size-3': size === 'sm' || size === 'xs',
        })}
      />
      <span className="text-rating font-bold tabular-nums">{rating}</span>
    </div>
  )
}
