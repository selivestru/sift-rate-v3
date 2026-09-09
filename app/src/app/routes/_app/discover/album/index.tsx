import { createFileRoute } from '@tanstack/react-router'

import { DiscoverSearchPage, albumSearchConfig, validateDiscoverSearch } from '~/modules/discover'

export const Route = createFileRoute('/_app/discover/album/')({
  validateSearch: validateDiscoverSearch,
  component: RouteComponent,
})

function RouteComponent() {
  const search = Route.useSearch()

  return <DiscoverSearchPage search={search} config={albumSearchConfig} />
}
