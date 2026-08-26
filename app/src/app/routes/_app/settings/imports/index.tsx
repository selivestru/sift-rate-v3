import { createFileRoute } from '@tanstack/react-router'

import { ImportsSettings } from '~/modules/import'

export const Route = createFileRoute('/_app/settings/imports/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ImportsSettings />
}
