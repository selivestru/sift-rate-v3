import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { reviewApi } from '../api/review.api'
import type { DeleteReviewVariables, ReviewStats } from '../types/review.types'
import { removeReviewFromListCaches } from '../utils/review-list-cache'
import { applyReviewDeleted } from '../utils/review-stats'
import {
  clearMediaStateReview,
  patchMyReviewStats,
  restoreMyReviewStats,
} from '../utils/review-stats-cache'

export const useDeleteReviewMutation = () => {
  return useMutation({
    mutationKey: ['delete-review'],
    mutationFn: reviewApi.deleteReview,
    onMutate: async (variables: DeleteReviewVariables, context) => {
      const { client } = context

      await client.cancelQueries({ queryKey: QUERIES_KEYS.myReviewStats })

      const previousStats = client.getQueryData<ReviewStats>(QUERIES_KEYS.myReviewStats)

      if (previousStats) {
        patchMyReviewStats(client, (stats) =>
          applyReviewDeleted(stats, {
            mediaType: variables.mediaType,
            rating: variables.rating,
          }),
        )
      }

      return { previousStats }
    },
    onError: (_error, _variables, onMutateResult, context) => {
      restoreMyReviewStats(context.client, onMutateResult?.previousStats)
    },
    onSuccess: (data, _variables, _onMutateResult, context) => {
      clearMediaStateReview(context.client, data.media)
      removeReviewFromListCaches(context.client, data)
    },
  })
}
