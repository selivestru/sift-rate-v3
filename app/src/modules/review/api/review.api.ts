import { api } from '~/common/api'

import type { MyReviewsResponse, RateMediaBody, Review } from '../types/review.types'

export const reviewApi = {
  getMyReviews: (params?: { cursor?: string; q?: string }) => {
    const searchParams = new URLSearchParams()

    if (params?.cursor) {
      searchParams.set('cursor', params.cursor)
    }

    const q = params?.q?.trim()
    if (q) {
      searchParams.set('q', q)
    }

    return api.get<MyReviewsResponse>('/review/me', { searchParams }).json()
  },
  upsertReview: (body: RateMediaBody) => {
    return api.put<Review>('/review', { json: body }).json()
  },
  deleteReview: (id: string) => {
    return api.delete<Review>(`/review/${id}`).json()
  },
}
