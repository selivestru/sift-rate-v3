import type { MediaType } from '~/common/constants/media-type'

export type PlannedListItem = {
  id: string
  createdAt: string
  media: {
    mediaType: MediaType
    externalId: string
    title: string
    posterUrl: string | null
  }
}

export type ListPlannedResult = {
  items: PlannedListItem[]
  total: number
}
