import { createLazyFileRoute } from '@tanstack/react-router'

import { ReviewList } from '~/modules/review'

export const Route = createLazyFileRoute('/_app/library/reviews')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ReviewList />
}
