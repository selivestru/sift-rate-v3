import { HTTPError } from 'ky'

import { useBookDetailQuery } from '../hooks/useBookDetailQuery'
import { BookDetailError } from './BookDetailError'
import { BookDetailNotFound } from './BookDetailNotFound'
import { BookDetailSkeleton } from './BookDetailSkeleton'
import { BookDetailView } from './BookDetailView'

interface BookDetailPageProps {
  externalId: string
}

type PageState = 'loading' | 'not-found' | 'error' | 'success'

export const BookDetailPage = ({ externalId }: BookDetailPageProps) => {
  const { data, isPending, isError, error, refetch } = useBookDetailQuery(externalId)

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
      {state === 'loading' && <BookDetailSkeleton />}
      {state === 'not-found' && <BookDetailNotFound externalId={externalId} />}
      {state === 'error' && <BookDetailError onRetry={() => void refetch()} />}
      {state === 'success' && data && <BookDetailView key={data.id} book={data} />}
    </>
  )
}
