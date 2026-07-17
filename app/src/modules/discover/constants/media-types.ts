import type { FileRoutesByTo } from '~/app/routeTree.gen'
import { MEDIA_TYPES, mediaTypeMeta, type MediaType } from '~/common/constants/media-type'

export interface MediaTypeDestination {
  type: MediaType
  to: keyof FileRoutesByTo
  description: string
}

export const mediaTypeDestinations: MediaTypeDestination[] = [
  {
    type: MEDIA_TYPES.MOVIE,
    to: '/discover/movie',
    description: 'Films to watch and archive',
  },
  {
    type: MEDIA_TYPES.TV_SHOW,
    to: '/discover/tv_show',
    description: 'Series and seasons',
  },
  {
    type: MEDIA_TYPES.TRACK,
    to: '/discover/track',
    description: 'Single moments',
  },
  {
    type: MEDIA_TYPES.ALBUM,
    to: '/discover/album',
    description: 'Full listens',
  },
  {
    type: MEDIA_TYPES.GAME,
    to: '/discover/game',
    description: 'Playthroughs ahead',
  },
  {
    type: MEDIA_TYPES.BOOK,
    to: '/discover/book',
    description: 'Pages and shelves',
  },
]

export const getMediaTypeDestinationMeta = (type: MediaType) => mediaTypeMeta[type]
