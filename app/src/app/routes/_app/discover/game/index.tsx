import { createFileRoute } from '@tanstack/react-router'

import { validateDiscoverSearch } from '~/modules/discover'

export const Route = createFileRoute('/_app/discover/game/')({
  validateSearch: validateDiscoverSearch,
})
