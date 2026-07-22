import { Star } from 'reicon-react'

import { cn } from '../utils/cn'
import { badgeVariants } from './Badge'

interface RatingBadgeProps {
  rating: number
  size?: 'xs' | 'sm' | 'md'
  variant?: 'default' | 'outline'
  className?: string
}

export const RatingBadge = ({
  rating,
  size = 'sm',
  variant = 'default',
  className,
}: RatingBadgeProps) => {
  const badgeSize = size === 'xs' ? 'sm' : size === 'md' ? 'md' : 'sm'

  return (
    <div
      className={cn(
        badgeVariants({
          variant: variant === 'default' ? 'rating' : 'outline',
          size: badgeSize,
        }),
        size === 'xs' && 'gap-0.5 px-1.5 py-0.5 text-[10px] [&_svg]:size-3!',
        size === 'md' && 'text-base [&_svg]:size-4!',
        size === 'sm' && 'text-sm [&_svg]:size-3.5!',
        'font-bold tabular-nums',
        className,
      )}
    >
      <Star weight="Filled" className="text-rating" />
      <span className={cn(variant === 'default' ? 'text-rating' : 'text-foreground')}>
        {rating}
      </span>
    </div>
  )
}
