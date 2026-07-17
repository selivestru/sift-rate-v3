import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/discover/movie/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Movie</div>
}
