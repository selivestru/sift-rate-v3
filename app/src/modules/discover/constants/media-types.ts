import {
  MEDIA_TYPES,
  mediaTypeMeta,
  mediaTypeToSlug,
  type MediaType,
} from '~/common/constants/media-type'

export interface MediaTypeDestination {
  type: MediaType
  mediaTypeSlug: (typeof mediaTypeToSlug)[MediaType]
  description: string
}

export const mediaTypeDestinations: MediaTypeDestination[] = [
  {
    type: MEDIA_TYPES.MOVIE,
    mediaTypeSlug: mediaTypeToSlug.MOVIE,
    description: 'Films to watch and archive',
  },
  {
    type: MEDIA_TYPES.TV_SHOW,
    mediaTypeSlug: mediaTypeToSlug.TV_SHOW,
    description: 'Series and seasons',
  },
  {
    type: MEDIA_TYPES.TRACK,
    mediaTypeSlug: mediaTypeToSlug.TRACK,
    description: 'Single moments',
  },
  {
    type: MEDIA_TYPES.ALBUM,
    mediaTypeSlug: mediaTypeToSlug.ALBUM,
    description: 'Full listens',
  },
  {
    type: MEDIA_TYPES.GAME,
    mediaTypeSlug: mediaTypeToSlug.GAME,
    description: 'Playthroughs ahead',
  },
  {
    type: MEDIA_TYPES.BOOK,
    mediaTypeSlug: mediaTypeToSlug.BOOK,
    description: 'Pages and shelves',
  },
]

export const getMediaTypeDestinationMeta = (type: MediaType) => mediaTypeMeta[type]
