import { useIntlayer } from 'react-intlayer'

import { mediaTypeMeta, type MediaType } from '~/common/constants/media-type'
import { useMediaTypeLabel } from '~/common/i18n'
import { PageHeader } from '~/common/ui/PageHeader'

const sourceByMediaType: Record<MediaType, { name: string; url: string }> = {
  MOVIE: { name: 'TMDB', url: 'https://www.themoviedb.org' },
  TV_SHOW: { name: 'TMDB', url: 'https://www.themoviedb.org' },
  ALBUM: { name: 'Spotify', url: 'https://open.spotify.com' },
  TRACK: { name: 'Spotify', url: 'https://open.spotify.com' },
  GAME: { name: 'IGDB', url: 'https://www.igdb.com' },
  BOOK: { name: 'Google Books', url: 'https://books.google.com' },
}

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
  const source = sourceByMediaType[mediaType]

  return (
    <div className="relative">
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
      <a
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/40 border-border absolute top-0 right-0 max-w-[60%] rounded-md border px-2.5 py-1.5 text-xs text-pretty transition-colors focus-visible:ring-2 focus-visible:outline-none"
        href={source.url}
        target="_blank"
        rel="noreferrer"
      >
        {content.dataSource({ source: source.name })}
      </a>
    </div>
  )
}
