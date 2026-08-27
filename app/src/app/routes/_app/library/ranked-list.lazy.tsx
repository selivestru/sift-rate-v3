import { createLazyFileRoute } from '@tanstack/react-router'

import { RankedListsPage } from '~/modules/ranked-list'

export const Route = createLazyFileRoute('/_app/library/ranked-list')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RankedListsPage />
}
