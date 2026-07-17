import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/life/timeline')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Timeline</div>
}
