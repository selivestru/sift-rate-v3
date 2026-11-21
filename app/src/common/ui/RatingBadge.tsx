import { Star } from 'reicon-react'

import { cn } from '../utils/cn'
import { badgeVariants } from './Badge'

interface RatingBadgeProps {
  rating: number
  size?: 'xs' | 'sm' | 'md'
  variant?: 'default' | 'rating'
  label?: string
  className?: string
}

export const RatingBadge = ({
  rating,
  size = 'sm',
  variant = 'default',
  label,
  className,
}: RatingBadgeProps) => {
  const badgeSize = size === 'xs' ? 'sm' : size === 'md' ? 'md' : 'sm'

  return (
    <div
      className={cn(
        badgeVariants({
          variant: variant === 'default' ? 'default' : 'rating',
          size: badgeSize,
        }),
        size === 'xs' && 'gap-0.5 px-1.5 py-0.5 text-[10px] [&_svg]:size-3!',
        size === 'md' && 'text-base [&_svg]:size-4!',
        size === 'sm' && 'text-sm [&_svg]:size-3.5!',
        'font-bold tabular-nums',
        className,
      )}
      title={label}
    >
      <Star weight="Filled" className="text-rating" />
      <span className={cn(variant === 'default' ? 'text-foreground' : 'text-rating')}>
        {rating}
      </span>
      {label && <span className="text-muted-foreground font-semibold">{label}</span>}
    </div>
  )
}
