import { mediaTypeMeta, type MediaType } from '../constants/media-type'
import { cn } from '../utils/cn'

interface MediaBadgeProps {
  mediaType: MediaType
  alternateColor?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export const MediaTypeBadge = ({
  mediaType,
  size = 'md',
  alternateColor,
  className,
}: MediaBadgeProps) => {
  const badge = mediaTypeMeta[mediaType]
  const BadgeIcon = badge.icon

  return (
    <div
      className={cn(
        'inline-flex w-fit items-center gap-1.5 rounded-full border font-semibold',
        {
          'px-2 py-0.5 text-[10px]': size === 'sm',
          'px-2.5 py-1 text-xs': size === 'md',
        },
        !alternateColor && 'transition-backdrop backdrop-blur-xs',
        className,
      )}
      style={{
        backgroundColor: alternateColor ? badge.color : `${badge.color}15`,
        borderColor: alternateColor ? badge.color : `${badge.color}30`,
        color: alternateColor ? 'white' : badge.color,
      }}
    >
      <BadgeIcon className="size-3.5" />
      {badge.label}
    </div>
  )
}
