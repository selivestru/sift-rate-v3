import { createFileRoute } from '@tanstack/react-router'

import { DiscoverSearchPage, trackSearchConfig, validateDiscoverSearch } from '~/modules/discover'

export const Route = createFileRoute('/_app/discover/track/')({
  validateSearch: validateDiscoverSearch,
  component: RouteComponent,
})

function RouteComponent() {
  const search = Route.useSearch()

  return <DiscoverSearchPage search={search} config={trackSearchConfig} />
}
