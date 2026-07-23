import { createFileRoute } from '@tanstack/react-router'

import { DangerZoneSettings } from '~/modules/settings'

export const Route = createFileRoute('/_app/settings/danger-zone')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DangerZoneSettings />
}
