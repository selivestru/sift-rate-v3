import { createFileRoute } from '@tanstack/react-router'

import { DiscoverSearchPage, tvSearchConfig, validateDiscoverSearch } from '~/modules/discover'

export const Route = createFileRoute('/_app/discover/tv_show/')({
  validateSearch: validateDiscoverSearch,
  component: RouteComponent,
})

function RouteComponent() {
  const search = Route.useSearch()

  return <DiscoverSearchPage search={search} config={tvSearchConfig} />
}
