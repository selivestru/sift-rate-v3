import { createLazyFileRoute } from '@tanstack/react-router'

import { AuthShell, CompleteProfileForm } from '~/modules/auth'

export const Route = createLazyFileRoute('/complete-profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AuthShell>
      <CompleteProfileForm />
    </AuthShell>
  )
}
