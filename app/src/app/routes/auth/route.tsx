import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { AuthShell } from '~/modules/auth'

export const Route = createFileRoute('/auth')({
  beforeLoad: ({ context }) => {
    const { user } = context.auth

    if (user) {
      throw redirect({ to: '/' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AuthShell>
      <Outlet />
    </AuthShell>
  )
}
