import { createFileRoute, redirect } from '@tanstack/react-router'

import { AuthShell, CompleteProfileForm } from '~/modules/auth'

export const Route = createFileRoute('/complete-profile')({
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
      <CompleteProfileForm />
    </AuthShell>
  )
}
