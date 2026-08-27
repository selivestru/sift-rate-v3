import { createLazyFileRoute } from '@tanstack/react-router'

import { AuthGoogleCallback } from '~/modules/auth'

export const Route = createLazyFileRoute('/auth/google/callback')({
  component: RouteComponent,
})

function RouteComponent() {
  const { status } = Route.useSearch()

  return <AuthGoogleCallback status={status!} />
}
