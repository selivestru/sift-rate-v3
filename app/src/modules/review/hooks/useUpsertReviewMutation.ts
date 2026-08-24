import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import { useAuthStore } from '~/modules/auth'
import type { MediaStateResponse } from '~/modules/discover'
import { removePlannedItemByMediaFromCache } from '~/modules/planned'

import { reviewApi } from '../api/review.api'
import type { ReviewStats, UpsertReviewVariables } from '../types/review.types'
import { upsertReviewInListCaches } from '../utils/review-list-cache'
import { applyReviewCreated, applyReviewRatingChanged } from '../utils/review-stats'
import {
  patchMyReviewStats,
  restoreMyReviewStats,
  setMediaStateReview,
} from '../utils/review-stats-cache'

export const useUpsertReviewMutation = () => {
  const user = useAuthStore((state) => state.user)

  return useMutation({
    mutationKey: ['upsert-review'],
    mutationFn: ({ previousReview: _, ...body }: UpsertReviewVariables) =>
      reviewApi.upsertReview(body),
    onMutate: async (variables, context) => {
      const { client } = context

      await client.cancelQueries({ queryKey: QUERIES_KEYS.myReviewStats })

      const previousStats = client.getQueryData<ReviewStats>(QUERIES_KEYS.myReviewStats)

      const mediaState = client.getQueryData<MediaStateResponse>(
        QUERIES_KEYS.mediaState({
          mediaType: variables.mediaType,
          externalId: variables.externalId,
        }),
      )

      const previousReview =
        variables.previousReview !== undefined
          ? variables.previousReview
          : (mediaState?.review ?? null)

      if (previousStats) {
        if (!previousReview) {
          patchMyReviewStats(client, (stats) =>
            applyReviewCreated(stats, {
              mediaType: variables.mediaType,
              rating: variables.rating,
            }),
          )
        } else if (previousReview.rating !== variables.rating) {
          patchMyReviewStats(client, (stats) =>
            applyReviewRatingChanged(stats, {
              fromRating: previousReview.rating,
              toRating: variables.rating,
            }),
          )
        }
      }

      return { previousStats, previousReview }
    },
    onError: (_error, _variables, onMutateResult, context) => {
      restoreMyReviewStats(context.client, onMutateResult?.previousStats)
    },
    onSuccess: (data, _variables, _onMutateResult, context) => {
      setMediaStateReview(context.client, data)
      removePlannedItemByMediaFromCache(context.client, data.media)
      upsertReviewInListCaches(
        context.client,
        data,
        user
          ? {
              id: user.id,
              username: user.username,
              avatarUrl: user.avatarUrl,
            }
          : null,
      )
    },
  })
}
