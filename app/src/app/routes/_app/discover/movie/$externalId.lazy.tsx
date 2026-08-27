import { createLazyFileRoute } from '@tanstack/react-router'

import { MovieDetailPage } from '~/modules/discover'

export const Route = createLazyFileRoute('/_app/discover/movie/$externalId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { externalId } = Route.useParams()
  return <MovieDetailPage key={externalId} externalId={externalId} />
}
