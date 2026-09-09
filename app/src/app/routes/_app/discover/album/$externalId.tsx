import { createFileRoute } from '@tanstack/react-router'

import { AlbumDetailPage } from '~/modules/discover'

export const Route = createFileRoute('/_app/discover/album/$externalId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { externalId } = Route.useParams()
  return <AlbumDetailPage key={externalId} externalId={externalId} />
}
