import { createLazyFileRoute } from '@tanstack/react-router'

import { TrackDetailPage } from '~/modules/discover'

export const Route = createLazyFileRoute('/_app/discover/track/$externalId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { externalId } = Route.useParams()
  return <TrackDetailPage key={externalId} externalId={externalId} />
}
