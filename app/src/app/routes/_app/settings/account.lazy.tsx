import { createLazyFileRoute } from '@tanstack/react-router'

import { AccountSettings } from '~/modules/settings'

export const Route = createLazyFileRoute('/_app/settings/account')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AccountSettings />
}
