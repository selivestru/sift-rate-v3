import { createFileRoute } from '@tanstack/react-router'

import { LifePage } from '~/modules/life'

export const Route = createFileRoute('/_app/life/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <LifePage />
}
