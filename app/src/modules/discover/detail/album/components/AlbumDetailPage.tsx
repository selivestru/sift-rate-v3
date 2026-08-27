import { MediaDetailBoundary } from '../../shared'
import { useAlbumDetailQuery } from '../hooks/useAlbumDetailQuery'
import { AlbumDetailError } from './AlbumDetailError'
import { AlbumDetailNotFound } from './AlbumDetailNotFound'
import { AlbumDetailSkeleton } from './AlbumDetailSkeleton'
import { AlbumDetailView } from './AlbumDetailView'

interface AlbumDetailPageProps {
  externalId: string
}

export const AlbumDetailPage = ({ externalId }: AlbumDetailPageProps) => {
  return (
    <MediaDetailBoundary
      fallback={<AlbumDetailSkeleton />}
      notFound={<AlbumDetailNotFound externalId={externalId} />}
      renderError={(onRetry) => <AlbumDetailError onRetry={onRetry} />}
    >
      <AlbumDetailContent externalId={externalId} />
    </MediaDetailBoundary>
  )
}

const AlbumDetailContent = ({ externalId }: AlbumDetailPageProps) => {
  const { data } = useAlbumDetailQuery(externalId)

  return <AlbumDetailView key={data.id} album={data} />
}
