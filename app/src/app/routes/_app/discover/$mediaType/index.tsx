import { createFileRoute, redirect } from '@tanstack/react-router'

import {
  getMediaTypeFromSlug,
  isMediaTypeSlug,
  type MediaTypeSlug,
} from '~/common/constants/media-type'
import {
  DiscoverSearchPage,
  getDiscoverSearchConfig,
  validateDiscoverSearch,
} from '~/modules/discover'

export const Route = createFileRoute('/_app/discover/$mediaType/')({
  beforeLoad: ({ params }) => {
    if (!isMediaTypeSlug(params.mediaType)) {
      return redirect({ to: '/discover' })
    }
  },
  validateSearch: validateDiscoverSearch,
  component: RouteComponent,
})

function RouteComponent() {
  const { mediaType: mediaTypeSlug } = Route.useParams()
  const mediaType = getMediaTypeFromSlug(mediaTypeSlug as MediaTypeSlug)
  const config = getDiscoverSearchConfig(mediaType)

  const search = Route.useSearch()

  return <DiscoverSearchPage key={mediaType} config={config} search={search} />
}
