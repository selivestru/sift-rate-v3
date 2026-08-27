import { createLazyFileRoute } from '@tanstack/react-router'

import { PlannedListPage } from '~/modules/planned'

export const Route = createLazyFileRoute('/_app/library/planned')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PlannedListPage />
}
