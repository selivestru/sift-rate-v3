import { PaginationCursorResponse } from '~/common/types/pagination-cursor.types'
import { Author } from '~/common/types/user.types'
import { Media, PlannedItem, Review } from '~/generated/prisma/client'
import { MediaType } from '~/generated/prisma/enums'

export type MediaTypeSlug = Lowercase<MediaType>

export const mediaTypeToSlug = Object.fromEntries(
  Object.values(MediaType).map((type) => [type, type.toLowerCase()]),
) as { [K in MediaType]: Lowercase<K> }

export const mediaTypeFromSlug = Object.fromEntries(
  Object.values(MediaType).map((type) => [type.toLowerCase(), type]),
) as { [K in MediaType as Lowercase<K>]: K }

export const MEDIA_TYPE_SLUGS = Object.keys(mediaTypeFromSlug)

export const isMediaTypeSlug = (value: string): value is MediaTypeSlug => {
  return value in mediaTypeFromSlug
}

export const getMediaTypeFromSlug = (slug: MediaTypeSlug): MediaType => {
  return mediaTypeFromSlug[slug]
}

export const getMediaTypeSlug = (type: MediaType): MediaTypeSlug => {
  return mediaTypeToSlug[type]
}

export const transformMediaTypeSlug = ({ value }: { value: unknown }): unknown => {
  if (typeof value === 'string' && isMediaTypeSlug(value)) {
    return getMediaTypeFromSlug(value)
  }

  return value
}

export interface MediaSearchResponse<T> {
  results: T[]
  totalResults: number
  totalPages: number
}

export interface MediaSnapshot {
  title: string
  posterUrl: string | null
  metadata?: Record<string, unknown>
}

export interface EnsureMediaResult {
  media: Media
  inserted: boolean
}

export type MediaStateResponse = {
  review: Review | null
  plannedItem: PlannedItem | null
}

type MediaReview = Review & {
  user: Author
}

export type MediaReviewsResponse = PaginationCursorResponse<MediaReview>
