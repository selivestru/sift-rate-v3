import { useIntlayer } from 'react-intlayer'

import type { FileRoutesByTo } from '~/app/routeTree.gen'

import { useMediaTypeLabels } from './useMediaTypeLabel'

export const useNavLabels = () => {
  const content = useIntlayer('navigation')
  const mediaTypeLabels = useMediaTypeLabels()

  return {
    '/': {
      label: content.home.value,
      description: content.homeDescription.value,
    },
    '/discover': {
      label: content.discover.value,
      description: content.discoverDescription.value,
    },
    '/discover/movie': {
      label: mediaTypeLabels.MOVIE,
      description: content.movieDescription.value,
    },
    '/discover/tv_show': {
      label: mediaTypeLabels.TV_SHOW,
      description: content.tvShowDescription.value,
    },
    '/discover/track': {
      label: mediaTypeLabels.TRACK,
      description: content.trackDescription.value,
    },
    '/discover/album': {
      label: mediaTypeLabels.ALBUM,
      description: content.albumDescription.value,
    },
    '/discover/game': {
      label: mediaTypeLabels.GAME,
      description: content.gameDescription.value,
    },
    '/discover/book': {
      label: mediaTypeLabels.BOOK,
      description: content.bookDescription.value,
    },
    '/library': {
      label: content.library.value,
      description: content.libraryDescription.value,
    },
    '/library/reviews': {
      label: content.reviews.value,
      description: content.reviewsDescription.value,
    },
    '/library/ranked-list': {
      label: content.rankedLists.value,
      description: content.rankedListsDescription.value,
    },
    '/library/planned': {
      label: content.planned.value,
      description: content.plannedDescription.value,
    },
  } as const satisfies Partial<Record<keyof FileRoutesByTo, { label: string; description: string }>>
}
