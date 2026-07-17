import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/library/planned')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Planned</div>
}
