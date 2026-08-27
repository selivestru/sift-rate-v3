import { MediaDetailBoundary } from '../../shared'
import { useTrackDetailQuery } from '../hooks/useTrackDetailQuery'
import { TrackDetailError } from './TrackDetailError'
import { TrackDetailNotFound } from './TrackDetailNotFound'
import { TrackDetailSkeleton } from './TrackDetailSkeleton'
import { TrackDetailView } from './TrackDetailView'

interface TrackDetailPageProps {
  externalId: string
}

export const TrackDetailPage = ({ externalId }: TrackDetailPageProps) => {
  return (
    <MediaDetailBoundary
      fallback={<TrackDetailSkeleton />}
      notFound={<TrackDetailNotFound externalId={externalId} />}
      renderError={(onRetry) => <TrackDetailError onRetry={onRetry} />}
    >
      <TrackDetailContent externalId={externalId} />
    </MediaDetailBoundary>
  )
}

const TrackDetailContent = ({ externalId }: TrackDetailPageProps) => {
  const { data } = useTrackDetailQuery(externalId)

  return <TrackDetailView key={data.id} track={data} />
}
