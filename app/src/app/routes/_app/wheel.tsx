import { createFileRoute } from '@tanstack/react-router'

import { WheelPage } from '~/pages/wheel'

export const Route = createFileRoute('/_app/wheel')({
  component: RouteComponent,
})

function RouteComponent() {
  return <WheelPage />
}
