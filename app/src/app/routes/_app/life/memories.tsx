import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/life/memories')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Memories</div>
}
