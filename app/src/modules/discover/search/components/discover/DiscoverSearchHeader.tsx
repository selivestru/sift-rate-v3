import { useIntlayer } from 'react-intlayer'

import { mediaTypeMeta, type MediaType } from '~/common/constants/media-type'
import { useMediaTypeLabel } from '~/common/i18n'
import { PageHeader } from '~/common/ui/PageHeader'

interface DiscoverSearchHeaderProps {
  mediaType: MediaType
  title: string
  description: string
  resultCount?: number
}

export const DiscoverSearchHeader = ({
  mediaType,
  title,
  description,
  resultCount,
}: DiscoverSearchHeaderProps) => {
  const meta = mediaTypeMeta[mediaType]
  const mediaLabel = useMediaTypeLabel(mediaType)
  const content = useIntlayer('discover-search-ui')

  return (
    <PageHeader
      icon={meta.icon}
      label={mediaLabel}
      title={title}
      description={description}
      iconWell="muted"
      iconColor={meta.color}
    >
      <p className="text-muted-foreground h-4 text-xs tabular-nums">
        {resultCount !== undefined &&
          (resultCount === 0 ? content.noResults.value : content.resultCount(resultCount))}
      </p>
    </PageHeader>
  )
}
