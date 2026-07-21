import type { MediaType } from '~/common/constants/media-type'

export const REVIEW_VISIBILITY = {
  PUBLIC: 'PUBLIC',
  FRIENDS: 'FRIENDS',
  PRIVATE: 'PRIVATE',
} as const

export type ReviewVisibility = (typeof REVIEW_VISIBILITY)[keyof typeof REVIEW_VISIBILITY]

export interface Review {
  id: string
  rating: number
  content: string | null
  visibility: ReviewVisibility
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

export interface RateMediaBody {
  mediaType: MediaType
  externalId: string
  rating: number
  content: string | null
  visibility: ReviewVisibility
  hasSpoiler: boolean
}
