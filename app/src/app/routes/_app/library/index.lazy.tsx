import { createLazyFileRoute } from '@tanstack/react-router'

import { LibraryPage } from '~/modules/library'

export const Route = createLazyFileRoute('/_app/library/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <LibraryPage />
}
