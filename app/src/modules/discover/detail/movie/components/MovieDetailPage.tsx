import { HTTPError } from 'ky'

import { useMovieDetailQuery } from '../hooks/useMovieDetailQuery'
import { MovieDetailError } from './MovieDetailError'
import { MovieDetailNotFound } from './MovieDetailNotFound'
import { MovieDetailSkeleton } from './MovieDetailSkeleton'
import { MovieDetailView } from './MovieDetailView'

interface MovieDetailPageProps {
  externalId: string
}

type PageState = 'loading' | 'not-found' | 'error' | 'success'

export const MovieDetailPage = ({ externalId }: MovieDetailPageProps) => {
  const { data, isPending, isError, error, refetch } = useMovieDetailQuery(externalId)

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
      {state === 'loading' && <MovieDetailSkeleton />}
      {state === 'not-found' && <MovieDetailNotFound externalId={externalId} />}
      {state === 'error' && <MovieDetailError onRetry={() => void refetch()} />}
      {state === 'success' && data && <MovieDetailView key={data.id} movie={data} />}
    </>
  )
}
