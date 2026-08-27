import { createLazyFileRoute } from '@tanstack/react-router'

import { ImportsSettings } from '~/modules/import'

export const Route = createLazyFileRoute('/_app/settings/imports/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ImportsSettings />
}
