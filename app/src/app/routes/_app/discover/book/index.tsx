import { createFileRoute } from '@tanstack/react-router'

import { DiscoverSearchPage, bookSearchConfig, validateDiscoverSearch } from '~/modules/discover'

export const Route = createFileRoute('/_app/discover/book/')({
  validateSearch: validateDiscoverSearch,
  component: RouteComponent,
})

function RouteComponent() {
  const search = Route.useSearch()

  return <DiscoverSearchPage search={search} config={bookSearchConfig} />
}
