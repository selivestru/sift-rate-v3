import { MediaDetailBoundary } from '../../shared'
import { useMovieDetailQuery } from '../hooks/useMovieDetailQuery'
import { MovieDetailError } from './MovieDetailError'
import { MovieDetailNotFound } from './MovieDetailNotFound'
import { MovieDetailSkeleton } from './MovieDetailSkeleton'
import { MovieDetailView } from './MovieDetailView'

interface MovieDetailPageProps {
  externalId: string
}

export const MovieDetailPage = ({ externalId }: MovieDetailPageProps) => {
  return (
    <MediaDetailBoundary
      fallback={<MovieDetailSkeleton />}
      notFound={<MovieDetailNotFound externalId={externalId} />}
      renderError={(onRetry) => <MovieDetailError onRetry={onRetry} />}
    >
      <MovieDetailContent externalId={externalId} />
    </MediaDetailBoundary>
  )
}

const MovieDetailContent = ({ externalId }: MovieDetailPageProps) => {
  const { data } = useMovieDetailQuery(externalId)

  return <MovieDetailView key={data.id} movie={data} />
}
