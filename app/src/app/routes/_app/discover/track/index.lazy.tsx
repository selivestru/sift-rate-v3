import { createLazyFileRoute } from '@tanstack/react-router'

import { DiscoverSearchPage, trackSearchConfig } from '~/modules/discover'

export const Route = createLazyFileRoute('/_app/discover/track/')({
  component: RouteComponent,
})

function RouteComponent() {
  const search = Route.useSearch()

  return <DiscoverSearchPage search={search} config={trackSearchConfig} />
}
