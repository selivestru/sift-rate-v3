import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { reviewApi } from '../api/review.api'
import type { DeleteReviewVariables } from '../types/review.types'

export const useDeleteReviewMutation = () => {
  return useMutation({
    mutationKey: ['delete-review'],
    mutationFn: ({ id }: DeleteReviewVariables) => reviewApi.deleteReview({ id }),
    onSuccess: (data, _variables, _, context) =>
      Promise.all([
        context.client.invalidateQueries({ queryKey: ['my-review-stats'] }),
        context.client.invalidateQueries({ queryKey: QUERIES_KEYS.mediaState(data.media) }),
        context.client.invalidateQueries({ queryKey: QUERIES_KEYS.myReviews }),
        context.client.invalidateQueries({ queryKey: QUERIES_KEYS.mediaReviews(data.media) }),
        context.client.invalidateQueries({ queryKey: QUERIES_KEYS.feed }),
        context.client.invalidateQueries({ queryKey: ['user-feed'] }),
        context.client.invalidateQueries({ queryKey: ['user-activity'] }),
        context.client.invalidateQueries({ queryKey: ['profile'] }),
      ]),
  })
}
