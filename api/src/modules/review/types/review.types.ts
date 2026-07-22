import { MediaType, Visibility } from '~/generated/prisma/enums'

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
  visibility: Visibility
  hasSpoiler: boolean
  createdAt: Date
  updatedAt: Date
  media: ReviewMediaCard
}

export type ReviewListResponse = {
  data: ReviewResponse[]
  nextCursor: string | null
}

export type ReviewStatsResponse = {
  total: number
  byMediaType: Partial<Record<MediaType, number>>
  byRating: Partial<Record<number, number>>
}
