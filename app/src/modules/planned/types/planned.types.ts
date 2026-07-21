import type { MediaType } from '~/common/constants/media-type'

export interface PlannedListItem {
  id: string
  createdAt: string
  media: {
    mediaType: MediaType
    externalId: string
    title: string
    posterUrl: string | null
  }
}

export interface PlannedListResponse {
  data: PlannedListItem[]
  totalResults: number
}

export interface AddToPlannedListBody {
  mediaType: string
  externalId: string
}
