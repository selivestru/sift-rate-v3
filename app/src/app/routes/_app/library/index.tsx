import { createFileRoute } from '@tanstack/react-router'

import { LibraryPage } from '~/modules/library'

export const Route = createFileRoute('/_app/library/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <LibraryPage />
}
