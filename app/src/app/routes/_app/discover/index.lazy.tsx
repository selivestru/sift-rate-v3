import { createLazyFileRoute } from '@tanstack/react-router'

import { DiscoverPage } from '~/modules/discover'

export const Route = createLazyFileRoute('/_app/discover/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DiscoverPage />
}
