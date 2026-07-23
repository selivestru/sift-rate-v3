import { createFileRoute } from '@tanstack/react-router'

import { TwoFactorSettings } from '~/modules/settings'

export const Route = createFileRoute('/_app/settings/2fa')({
  component: RouteComponent,
})

function RouteComponent() {
  return <TwoFactorSettings />
}
