import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/discover/book/$externalId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>BookById</div>
}
