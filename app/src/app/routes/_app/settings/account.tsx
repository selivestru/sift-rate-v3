import { createFileRoute } from '@tanstack/react-router'

import { AccountSettings } from '~/modules/settings'

export const Route = createFileRoute('/_app/settings/account')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AccountSettings />
}
