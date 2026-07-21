import { createFileRoute } from '@tanstack/react-router'

import { ReviewList } from '~/modules/review'

export const Route = createFileRoute('/_app/library/reviews')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ReviewList />
}
