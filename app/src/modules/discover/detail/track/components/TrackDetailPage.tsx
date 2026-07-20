import { HTTPError } from 'ky'

import { useTrackDetailQuery } from '../hooks/useTrackDetailQuery'
import { TrackDetailError } from './TrackDetailError'
import { TrackDetailNotFound } from './TrackDetailNotFound'
import { TrackDetailSkeleton } from './TrackDetailSkeleton'
import { TrackDetailView } from './TrackDetailView'

interface TrackDetailPageProps {
  externalId: string
}

type PageState = 'loading' | 'not-found' | 'error' | 'success'

export const TrackDetailPage = ({ externalId }: TrackDetailPageProps) => {
  const { data, isPending, isError, error, refetch } = useTrackDetailQuery(externalId)

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
      {state === 'loading' && <TrackDetailSkeleton />}
      {state === 'not-found' && <TrackDetailNotFound externalId={externalId} />}
      {state === 'error' && <TrackDetailError onRetry={() => void refetch()} />}
      {state === 'success' && data && <TrackDetailView key={data.id} track={data} />}
    </>
  )
}
