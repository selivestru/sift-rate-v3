import { createLazyFileRoute } from '@tanstack/react-router'

import { DiscoverSearchPage, tvSearchConfig } from '~/modules/discover'

export const Route = createLazyFileRoute('/_app/discover/tv_show/')({
  component: RouteComponent,
})

function RouteComponent() {
  const search = Route.useSearch()

  return <DiscoverSearchPage search={search} config={tvSearchConfig} />
}
