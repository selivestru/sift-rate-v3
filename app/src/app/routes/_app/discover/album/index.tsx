import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/discover/album/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Album</div>
}
