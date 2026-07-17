import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/discover/tv_show/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>TvShow</div>
}
