import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/life/wrapped')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Wrapped</div>
}
