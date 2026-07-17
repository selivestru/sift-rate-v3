import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/wheel')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Wheel</div>
}
