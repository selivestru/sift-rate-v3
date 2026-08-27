import { useMediaTypeLabel } from '~/common/i18n'

import { mediaTypeMeta, type MediaType } from '../constants/media-type'
import { Badge } from './Badge'

interface MediaBadgeProps {
  mediaType: MediaType
  size?: 'sm' | 'md'
  className?: string
}

export const MediaTypeBadge = ({ mediaType, size = 'md', className }: MediaBadgeProps) => {
  const meta = mediaTypeMeta[mediaType]
  const Icon = meta.icon
  const label = useMediaTypeLabel(mediaType)

  return (
    <Badge color={meta.color} size={size} startIcon={<Icon />} className={className}>
      {label}
    </Badge>
  )
}
