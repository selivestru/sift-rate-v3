import { useMediaTypeLabel } from '~/common/i18n'

import { mediaTypeMeta, type MediaType } from '../constants/media-type'
import { Badge } from './Badge'

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
  const meta = mediaTypeMeta[mediaType]
  const Icon = meta.icon
  const label = useMediaTypeLabel(mediaType)

  return (
    <Badge
      color={meta.color}
      isSolid={alternateColor}
      size={size}
      startIcon={<Icon />}
      className={className}
    >
      {label}
    </Badge>
  )
}
