import { createFileRoute } from '@tanstack/react-router'

import { DiscoverSearchPage, gameSearchConfig, validateDiscoverSearch } from '~/modules/discover'

export const Route = createFileRoute('/_app/discover/game/')({
  validateSearch: validateDiscoverSearch,
  component: RouteComponent,
})

function RouteComponent() {
  const search = Route.useSearch()

  return <DiscoverSearchPage search={search} config={gameSearchConfig} />
}
