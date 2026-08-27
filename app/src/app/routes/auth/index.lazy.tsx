import { createLazyFileRoute } from '@tanstack/react-router'

import { GoogleAuthButton } from '~/modules/auth'

export const Route = createLazyFileRoute('/auth/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <GoogleAuthButton />
}
