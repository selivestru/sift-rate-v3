import { createFileRoute } from '@tanstack/react-router'

import { FeedPage } from '~/modules/feed'

export const Route = createFileRoute('/_app/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <FeedPage />
}
