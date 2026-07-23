import { createFileRoute } from '@tanstack/react-router'

import { AppearanceSettings } from '~/modules/settings'

export const Route = createFileRoute('/_app/settings/appearance')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AppearanceSettings />
}
