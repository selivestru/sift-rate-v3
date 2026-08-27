import { createLazyFileRoute } from '@tanstack/react-router'

import { TvShowDetailPage } from '~/modules/discover'

export const Route = createLazyFileRoute('/_app/discover/tv_show/$externalId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { externalId } = Route.useParams()
  return <TvShowDetailPage key={externalId} externalId={externalId} />
}
