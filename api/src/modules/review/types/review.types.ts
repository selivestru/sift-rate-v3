import { JsonValue } from '@prisma/client/runtime/client'
import { PaginationCursorResponse } from '~/common/types/pagination-cursor.types'
import { MediaType } from '~/generated/prisma/enums'

export type ReviewMediaCard = {
  id: string
  externalId: string
  mediaType: MediaType
  title: string
  posterUrl: string | null
  metadata: JsonValue | null
}

export type ReviewItem = {
  id: string
  rating: number
  content: string | null
  createdAt: Date
  updatedAt: Date
  media: ReviewMediaCard
}

export type ReviewsResponse = PaginationCursorResponse<ReviewItem>

export type ReviewStatsResponse = {
  total: number
  byMediaType: Partial<Record<MediaType, number>>
  byRating: Partial<Record<number, number>>
}
