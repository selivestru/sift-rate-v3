import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/library/lists/$listId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>ListsById</div>
}
