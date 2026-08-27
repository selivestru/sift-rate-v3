import { createLazyFileRoute } from '@tanstack/react-router'

import { FeedPage } from '~/modules/feed'

export const Route = createLazyFileRoute('/_app/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <FeedPage />
}
