import { mediaTypeMeta, type MediaType } from '../constants/media-type'
import { cn } from '../utils/cn'

interface MediaBadgeProps {
  mediaType: MediaType
  className?: string
}

export const MediaTypeBadge = ({ mediaType, className }: MediaBadgeProps) => {
  const badge = mediaTypeMeta[mediaType]
  const BadgeIcon = badge.icon

  return (
    <div
      className={cn(
        'transition-backdrop inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold backdrop-blur-xs',
        className,
      )}
      style={{
        backgroundColor: `${badge.color}15`,
        borderColor: `${badge.color}30`,
        color: badge.color,
      }}
    >
      <BadgeIcon className="size-3.5" />
      {badge.label}
    </div>
  )
}
