import { MediaType, ReviewVisibility } from '~/generated/prisma/enums'

export type ReviewMediaCard = {
  id: string
  externalId: string
  mediaType: MediaType
  title: string
  posterUrl: string | null
}

export type ReviewResponse = {
  id: string
  rating: number
  content: string | null
  visibility: ReviewVisibility
  hasSpoiler: boolean
  createdAt: Date
  updatedAt: Date
  media: ReviewMediaCard
}

export type ReviewListResponse = {
  data: ReviewResponse[]
  nextCursor: string | null
}
