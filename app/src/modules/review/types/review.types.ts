import type { MediaType } from '~/common/constants/media-type'

export interface Review {
  id: string
  rating: number
  content: string | null
  createdAt: string
  updatedAt: string
  media: ReviewMediaCard
}

export type ReviewMediaCard = {
  id: string
  externalId: string
  mediaType: MediaType
  title: string
  posterUrl: string | null
}

export interface MyReviewsResponse {
  data: Review[]
  nextCursor: string | null
}

export interface ReviewStats {
  total: number
  byMediaType: Partial<Record<MediaType, number>>
  byRating: Partial<Record<number, number>>
}

export interface RateMediaBody {
  mediaType: MediaType
  externalId: string
  rating: number
  content: string | null
}

export type UpsertReviewVariables = RateMediaBody & {
  previousReview?: Pick<Review, 'id' | 'rating'> | null
}

export type DeleteReviewVariables = {
  id: string
  rating: number
  mediaType: MediaType
}
