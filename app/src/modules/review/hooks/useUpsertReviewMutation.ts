import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import type { MediaStateResponse } from '~/modules/discover'

import { reviewApi } from '../api/review.api'
import type { ReviewStats, UpsertReviewVariables } from '../types/review.types'
import { applyReviewCreated, applyReviewRatingChanged } from '../utils/review-stats'
import { patchMyReviewStats } from '../utils/review-stats-cache'

export const useUpsertReviewMutation = () => {
  return useMutation({
    mutationKey: ['upsert-review'],
    mutationFn: ({ previousReview: _, ...body }: UpsertReviewVariables) =>
      reviewApi.upsertReview(body),
    onMutate: async (variables, context) => {
      const { client } = context

      await client.cancelQueries({ queryKey: QUERIES_KEYS.MY_REVIEW_STATS })

      const previousStats = client.getQueryData<ReviewStats>(QUERIES_KEYS.MY_REVIEW_STATS)

      const mediaState = client.getQueryData<MediaStateResponse>(
        QUERIES_KEYS.MEDIA_STATE({
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
      if (onMutateResult?.previousStats) {
        context.client.setQueryData(QUERIES_KEYS.MY_REVIEW_STATS, onMutateResult.previousStats)
      }
    },
    onSuccess: (data, _variables, onMutateResult, context) => {
      const { media } = data

      if (!onMutateResult?.previousStats) {
        context.client.invalidateQueries({
          queryKey: QUERIES_KEYS.MY_REVIEW_STATS,
        })
      }

      context.client.invalidateQueries({
        queryKey: QUERIES_KEYS.MY_REVIEWS,
      })
      context.client.invalidateQueries({
        queryKey: QUERIES_KEYS.MEDIA_REVIEWS({
          mediaType: media.mediaType,
          externalId: media.externalId,
        }),
      })

      context.client.setQueryData<MediaStateResponse>(
        QUERIES_KEYS.MEDIA_STATE({ externalId: media.externalId, mediaType: media.mediaType }),
        (prev) => {
          if (!prev) return prev

          return {
            review: data,
            plannedItem: null,
          }
        },
      )
    },
  })
}
