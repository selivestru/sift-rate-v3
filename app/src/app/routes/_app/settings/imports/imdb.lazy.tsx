import { createLazyFileRoute } from '@tanstack/react-router'

import { ImdbImportPage } from '~/modules/import'

export const Route = createLazyFileRoute('/_app/settings/imports/imdb')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ImdbImportPage />
}
