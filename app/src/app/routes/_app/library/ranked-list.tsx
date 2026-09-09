import { createFileRoute } from '@tanstack/react-router'

import { RankedListsPage } from '~/modules/ranked-list'

export const Route = createFileRoute('/_app/library/ranked-list')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RankedListsPage />
}
