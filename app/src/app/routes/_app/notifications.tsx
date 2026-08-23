import { createFileRoute, redirect } from '@tanstack/react-router'

import { NotificationsPage } from '~/modules/notifications'

export const Route = createFileRoute('/_app/notifications')({
  beforeLoad: ({ context }) => {
    const { user } = context.auth

    if (!user) {
      throw redirect({ to: '/' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <NotificationsPage />
}
