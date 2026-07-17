import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/discover/track/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Track</div>
}
