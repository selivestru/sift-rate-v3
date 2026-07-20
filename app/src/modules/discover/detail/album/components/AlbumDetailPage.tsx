import { HTTPError } from 'ky'

import { useAlbumDetailQuery } from '../hooks/useAlbumDetailQuery'
import { AlbumDetailError } from './AlbumDetailError'
import { AlbumDetailNotFound } from './AlbumDetailNotFound'
import { AlbumDetailSkeleton } from './AlbumDetailSkeleton'
import { AlbumDetailView } from './AlbumDetailView'

interface AlbumDetailPageProps {
  externalId: string
}

type PageState = 'loading' | 'not-found' | 'error' | 'success'

export const AlbumDetailPage = ({ externalId }: AlbumDetailPageProps) => {
  const { data, isPending, isError, error, refetch } = useAlbumDetailQuery(externalId)

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
      {state === 'loading' && <AlbumDetailSkeleton />}
      {state === 'not-found' && <AlbumDetailNotFound externalId={externalId} />}
      {state === 'error' && <AlbumDetailError onRetry={() => void refetch()} />}
      {state === 'success' && data && <AlbumDetailView key={data.id} album={data} />}
    </>
  )
}
