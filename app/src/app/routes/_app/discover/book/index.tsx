import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/discover/book/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Book</div>
}
