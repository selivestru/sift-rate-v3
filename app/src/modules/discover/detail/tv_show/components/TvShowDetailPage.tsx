import { MediaDetailBoundary } from '../../shared'
import { useTvShowDetailQuery } from '../hooks/useTvShowDetailQuery'
import { TvShowDetailError } from './TvShowDetailError'
import { TvShowDetailNotFound } from './TvShowDetailNotFound'
import { TvShowDetailSkeleton } from './TvShowDetailSkeleton'
import { TvShowDetailView } from './TvShowDetailView'

interface TvShowDetailPageProps {
  externalId: string
}

export const TvShowDetailPage = ({ externalId }: TvShowDetailPageProps) => {
  return (
    <MediaDetailBoundary
      fallback={<TvShowDetailSkeleton />}
      notFound={<TvShowDetailNotFound externalId={externalId} />}
      renderError={(onRetry) => <TvShowDetailError onRetry={onRetry} />}
    >
      <TvShowDetailContent externalId={externalId} />
    </MediaDetailBoundary>
  )
}

const TvShowDetailContent = ({ externalId }: TvShowDetailPageProps) => {
  const { data } = useTvShowDetailQuery(externalId)

  return <TvShowDetailView key={data.id} show={data} />
}
