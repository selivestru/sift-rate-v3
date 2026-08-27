import { createLazyFileRoute } from '@tanstack/react-router'

import { DiscoverSearchPage, albumSearchConfig } from '~/modules/discover'

export const Route = createLazyFileRoute('/_app/discover/album/')({
  component: RouteComponent,
})

function RouteComponent() {
  const search = Route.useSearch()

  return <DiscoverSearchPage search={search} config={albumSearchConfig} />
}
