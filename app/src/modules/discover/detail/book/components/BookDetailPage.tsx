import { MediaDetailBoundary } from '../../shared'
import { useBookDetailQuery } from '../hooks/useBookDetailQuery'
import { BookDetailError } from './BookDetailError'
import { BookDetailNotFound } from './BookDetailNotFound'
import { BookDetailSkeleton } from './BookDetailSkeleton'
import { BookDetailView } from './BookDetailView'

interface BookDetailPageProps {
  externalId: string
}

export const BookDetailPage = ({ externalId }: BookDetailPageProps) => {
  return (
    <MediaDetailBoundary
      fallback={<BookDetailSkeleton />}
      notFound={<BookDetailNotFound externalId={externalId} />}
      renderError={(onRetry) => <BookDetailError onRetry={onRetry} />}
    >
      <BookDetailContent externalId={externalId} />
    </MediaDetailBoundary>
  )
}

const BookDetailContent = ({ externalId }: BookDetailPageProps) => {
  const { data } = useBookDetailQuery(externalId)

  return <BookDetailView key={data.id} book={data} />
}
