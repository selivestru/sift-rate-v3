import { createFileRoute, redirect } from '@tanstack/react-router'

import { AuthShell } from '~/modules/auth'
import { WelcomeForm } from '~/modules/user'

export const Route = createFileRoute('/welcome')({
  beforeLoad: ({ context }) => {
    const { user } = context.auth

    if (!user || user.username) {
      throw redirect({ to: '/' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AuthShell>
      <WelcomeForm />
    </AuthShell>
  )
}
