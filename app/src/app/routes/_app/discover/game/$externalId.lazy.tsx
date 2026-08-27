import { createLazyFileRoute } from '@tanstack/react-router'

import { GameDetailPage } from '~/modules/discover'

export const Route = createLazyFileRoute('/_app/discover/game/$externalId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { externalId } = Route.useParams()
  return <GameDetailPage key={externalId} externalId={externalId} />
}
