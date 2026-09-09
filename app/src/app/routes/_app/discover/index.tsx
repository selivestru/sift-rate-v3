import { createFileRoute } from '@tanstack/react-router'

import { DiscoverPage } from '~/modules/discover'

export const Route = createFileRoute('/_app/discover/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DiscoverPage />
}
