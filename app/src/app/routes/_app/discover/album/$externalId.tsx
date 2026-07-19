import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/discover/album/$externalId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Route</div>
}
