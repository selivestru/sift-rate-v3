import { MediaDetailBoundary } from '../../shared'
import { useGameDetailQuery } from '../hooks/useGameDetailQuery'
import { GameDetailError } from './GameDetailError'
import { GameDetailNotFound } from './GameDetailNotFound'
import { GameDetailSkeleton } from './GameDetailSkeleton'
import { GameDetailView } from './GameDetailView'

interface GameDetailPageProps {
  externalId: string
}

export const GameDetailPage = ({ externalId }: GameDetailPageProps) => {
  return (
    <MediaDetailBoundary
      fallback={<GameDetailSkeleton />}
      notFound={<GameDetailNotFound externalId={externalId} />}
      renderError={(onRetry) => <GameDetailError onRetry={onRetry} />}
    >
      <GameDetailContent externalId={externalId} />
    </MediaDetailBoundary>
  )
}

const GameDetailContent = ({ externalId }: GameDetailPageProps) => {
  const { data } = useGameDetailQuery(externalId)

  return <GameDetailView key={data.id} game={data} />
}
