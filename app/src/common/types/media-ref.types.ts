import type { MediaType } from '../constants/media-type'

export interface MediaRef {
  mediaType: MediaType
  externalId: string
}
