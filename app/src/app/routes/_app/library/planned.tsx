import { createFileRoute } from '@tanstack/react-router'

import { PlannedListPage } from '~/modules/planned'

export const Route = createFileRoute('/_app/library/planned')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PlannedListPage />
}
