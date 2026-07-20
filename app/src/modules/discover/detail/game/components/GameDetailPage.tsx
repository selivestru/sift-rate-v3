import { HTTPError } from 'ky'

import { useGameDetailQuery } from '../hooks/useGameDetailQuery'
import { GameDetailError } from './GameDetailError'
import { GameDetailNotFound } from './GameDetailNotFound'
import { GameDetailSkeleton } from './GameDetailSkeleton'
import { GameDetailView } from './GameDetailView'

interface GameDetailPageProps {
  externalId: string
}

type PageState = 'loading' | 'not-found' | 'error' | 'success'

export const GameDetailPage = ({ externalId }: GameDetailPageProps) => {
  const { data, isPending, isError, error, refetch } = useGameDetailQuery(externalId)

  const isNotFound = isError && error instanceof HTTPError && error.response.status === 404

  let state: PageState = 'loading'
  if (isPending) {
    state = 'loading'
  } else if (isNotFound) {
    state = 'not-found'
  } else if (isError) {
    state = 'error'
  } else if (data) {
    state = 'success'
  }

  return (
    <>
      {state === 'loading' && <GameDetailSkeleton />}
      {state === 'not-found' && <GameDetailNotFound externalId={externalId} />}
      {state === 'error' && <GameDetailError onRetry={() => void refetch()} />}
      {state === 'success' && data && <GameDetailView key={data.id} game={data} />}
    </>
  )
}
