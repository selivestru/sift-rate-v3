import { api } from '~/common/api'

import type { ReviewSort } from '../constants/sort'
import type {
  DeleteReviewVariables,
  MyReviewsResponse,
  RateMediaBody,
  Review,
  ReviewStats,
} from '../types/review.types'

export const reviewApi = {
  getMyReviews: (params?: {
    cursor?: string
    q?: string
    mediaType?: string
    rating?: number
    sort?: ReviewSort
    year?: number
    month?: number
  }) => {
    const searchParams = new URLSearchParams()

    if (params?.cursor) {
      searchParams.set('cursor', params.cursor)
    }

    const q = params?.q?.trim()
    if (q) {
      searchParams.set('q', q)
    }

    if (params?.mediaType) {
      searchParams.set('mediaType', params.mediaType)
    }

    if (params?.rating != null) {
      searchParams.set('rating', String(params.rating))
    }

    if (params?.sort) {
      searchParams.set('sort', params.sort)
    }

    if (params?.year != null) {
      searchParams.set('year', String(params.year))

      if (params.month != null) {
        searchParams.set('month', String(params.month))
      }
    }

    return api.get<MyReviewsResponse>('/review/me', { searchParams }).json()
  },
  getMyReviewStats: (year?: number, month?: number) => {
    const searchParams = new URLSearchParams()

    if (year != null) {
      searchParams.set('year', String(year))

      if (month != null) {
        searchParams.set('month', String(month))
      }
    }

    return api.get<ReviewStats>('/review/me/stats', { searchParams }).json()
  },
  upsertReview: (body: RateMediaBody) => {
    return api.put<Review>('/review', { json: body }).json()
  },
  deleteReview: ({ id }: Pick<DeleteReviewVariables, 'id'>) => {
    return api.delete<Review>(`/review/${id}`).json()
  },
}
