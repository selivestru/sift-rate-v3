import { mediaTypeMeta, type MediaType } from '~/common/constants/media-type'
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

  return (
    <PageHeader
      icon={meta.icon}
      label={meta.label}
      title={title}
      description={description}
      iconWell="muted"
      iconColor={meta.color}
    >
      <p className="text-muted-foreground h-4 text-xs tabular-nums">
        {resultCount !== undefined &&
          (resultCount === 0
            ? 'No results'
            : `${resultCount.toLocaleString()} result${resultCount === 1 ? '' : 's'}`)}
      </p>
    </PageHeader>
  )
}
