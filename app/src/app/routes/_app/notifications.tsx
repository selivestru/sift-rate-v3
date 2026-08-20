import { createFileRoute } from '@tanstack/react-router'

import { NotificationsPage } from '~/modules/notifications'

export const Route = createFileRoute('/_app/notifications')({
  component: RouteComponent,
})

function RouteComponent() {
  return <NotificationsPage />
}
