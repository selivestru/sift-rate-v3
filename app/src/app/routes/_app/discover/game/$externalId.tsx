import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/discover/game/$externalId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>GameById</div>
}
