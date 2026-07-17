import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/discover/game/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Game</div>
}
