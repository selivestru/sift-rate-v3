import { createLazyFileRoute } from '@tanstack/react-router'

import { DiscoverSearchPage, gameSearchConfig } from '~/modules/discover'

export const Route = createLazyFileRoute('/_app/discover/game/')({
  component: RouteComponent,
})

function RouteComponent() {
  const search = Route.useSearch()

  return <DiscoverSearchPage search={search} config={gameSearchConfig} />
}
