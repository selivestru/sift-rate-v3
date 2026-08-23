import { createFileRoute } from '@tanstack/react-router'

import { FollowRequestsPage } from '~/modules/profile'

export const Route = createFileRoute('/_app/follow-requests')({
  component: RouteComponent,
})

function RouteComponent() {
  return <FollowRequestsPage />
}
