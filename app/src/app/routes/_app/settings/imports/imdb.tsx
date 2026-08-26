import { createFileRoute } from '@tanstack/react-router'

import { ImdbImportPage } from '~/modules/import'

export const Route = createFileRoute('/_app/settings/imports/imdb')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ImdbImportPage />
}
