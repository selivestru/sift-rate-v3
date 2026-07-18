import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/discover/$mediaType/$externalId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { mediaType, externalId } = Route.useParams()

  return (
    <div>
      {mediaType} / {externalId}
    </div>
  )
}
