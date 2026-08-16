import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/post/$postId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/post/$postId"!</div>
}
