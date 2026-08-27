import { createLazyFileRoute } from '@tanstack/react-router'

import { DiscoverSearchPage, bookSearchConfig } from '~/modules/discover'

export const Route = createLazyFileRoute('/_app/discover/book/')({
  component: RouteComponent,
})

function RouteComponent() {
  const search = Route.useSearch()

  return <DiscoverSearchPage search={search} config={bookSearchConfig} />
}
