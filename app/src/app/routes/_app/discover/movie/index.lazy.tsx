import { createLazyFileRoute } from '@tanstack/react-router'

import { DiscoverSearchPage, movieSearchConfig } from '~/modules/discover'

export const Route = createLazyFileRoute('/_app/discover/movie/')({
  component: RouteComponent,
})

function RouteComponent() {
  const search = Route.useSearch()

  return <DiscoverSearchPage search={search} config={movieSearchConfig} />
}
