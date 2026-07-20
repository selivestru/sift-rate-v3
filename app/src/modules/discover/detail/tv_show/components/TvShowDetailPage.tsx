import { HTTPError } from 'ky'

import { useTvShowDetailQuery } from '../hooks/useTvShowDetailQuery'
import { TvShowDetailError } from './TvShowDetailError'
import { TvShowDetailNotFound } from './TvShowDetailNotFound'
import { TvShowDetailSkeleton } from './TvShowDetailSkeleton'
import { TvShowDetailView } from './TvShowDetailView'

interface TvShowDetailPageProps {
  externalId: string
}

type PageState = 'loading' | 'not-found' | 'error' | 'success'

export const TvShowDetailPage = ({ externalId }: TvShowDetailPageProps) => {
  const { data, isPending, isError, error, refetch } = useTvShowDetailQuery(externalId)

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
      {state === 'loading' && <TvShowDetailSkeleton />}
      {state === 'not-found' && <TvShowDetailNotFound externalId={externalId} />}
      {state === 'error' && <TvShowDetailError onRetry={() => void refetch()} />}
      {state === 'success' && data && <TvShowDetailView key={data.id} show={data} />}
    </>
  )
}
