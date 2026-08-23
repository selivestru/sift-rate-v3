import { createFileRoute, redirect } from '@tanstack/react-router'

import { FollowRequestsPage } from '~/modules/profile'

export const Route = createFileRoute('/_app/follow-requests')({
  beforeLoad: ({ context }) => {
    const { user } = context.auth

    if (!user || !user.isPrivate) {
      throw redirect({ to: '/' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <FollowRequestsPage />
}
