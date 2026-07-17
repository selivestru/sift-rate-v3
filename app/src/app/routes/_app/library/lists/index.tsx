import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/library/lists/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Lists</div>
}
