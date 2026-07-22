import type { MediaType } from '~/common/constants/media-type'

export const VISIBILITY = {
  PRIVATE: 'PRIVATE',
  FRIENDS: 'FRIENDS',
  PUBLIC: 'PUBLIC',
} as const

export type Visibility = (typeof VISIBILITY)[keyof typeof VISIBILITY]

export interface Review {
  id: string
  rating: number
  content: string | null
  visibility: Visibility
  hasSpoiler: boolean
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
  visibility: Visibility
  hasSpoiler: boolean
}

export type UpsertReviewVariables = RateMediaBody & {
  previousReview?: Pick<Review, 'id' | 'rating'> | null
}

export type DeleteReviewVariables = {
  id: string
  rating: number
  mediaType: MediaType
}
