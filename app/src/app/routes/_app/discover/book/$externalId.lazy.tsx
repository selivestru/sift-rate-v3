import { createLazyFileRoute } from '@tanstack/react-router'

import { BookDetailPage } from '~/modules/discover'

export const Route = createLazyFileRoute('/_app/discover/book/$externalId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { externalId } = Route.useParams()
  return <BookDetailPage key={externalId} externalId={externalId} />
}
