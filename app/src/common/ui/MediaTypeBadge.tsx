import { mediaTypeMeta, type MediaType } from '../constants/media-type'
import { cn } from '../utils/cn'

interface MediaBadgeProps {
  mediaType: MediaType
  alternateColor?: boolean
  className?: string
}

export const MediaTypeBadge = ({ mediaType, alternateColor, className }: MediaBadgeProps) => {
  const badge = mediaTypeMeta[mediaType]
  const BadgeIcon = badge.icon

  return (
    <div
      className={cn(
        'inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold',
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
