import { api } from '~/common/api'

import type { MyReviewsResponse, RateMediaBody, Review } from '../types/review.types'

export const reviewApi = {
  getMyReviews: (cursor?: string) => {
    const searchParams = new URLSearchParams()

    if (cursor) {
      searchParams.set('cursor', cursor)
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
