import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/library/ratings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Ratings</div>
}
