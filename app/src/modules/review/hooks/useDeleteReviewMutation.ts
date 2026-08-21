import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import type { MediaStateResponse } from '~/modules/discover'

import { reviewApi } from '../api/review.api'
import type { DeleteReviewVariables, ReviewStats } from '../types/review.types'
import { applyReviewDeleted } from '../utils/review-stats'
import { patchMyReviewStats } from '../utils/review-stats-cache'

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
      if (onMutateResult?.previousStats) {
        context.client.setQueryData(QUERIES_KEYS.myReviewStats, onMutateResult.previousStats)
      }
    },
    onSuccess: (data, _variables, onMutateResult, context) => {
      const { media } = data

      if (!onMutateResult?.previousStats) {
        context.client.invalidateQueries({
          queryKey: QUERIES_KEYS.myReviewStats,
        })
      }

      context.client.invalidateQueries({
        queryKey: QUERIES_KEYS.myReviews,
      })
      context.client.invalidateQueries({
        queryKey: QUERIES_KEYS.mediaReviews({
          mediaType: media.mediaType,
          externalId: media.externalId,
        }),
      })

      context.client.setQueryData<MediaStateResponse>(
        QUERIES_KEYS.mediaState({ externalId: media.externalId, mediaType: media.mediaType }),
        (prev) => {
          if (!prev) return prev

          return {
            review: null,
            plannedItem: null,
          }
        },
      )
    },
  })
}
