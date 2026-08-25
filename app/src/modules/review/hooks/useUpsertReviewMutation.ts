import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import { useAuthStore } from '~/modules/auth'
import type { MediaStateResponse } from '~/modules/discover'
import { removePlannedItemByMediaFromCache } from '~/modules/planned'

import { reviewApi } from '../api/review.api'
import type { UpsertReviewVariables } from '../types/review.types'
import { upsertReviewInFeedCaches, upsertReviewInListCaches } from '../utils/review-list-cache'
import {
  applyProfileRatingChanged,
  applyProfileReviewCreated,
  bumpUserActivity,
  patchProfileReviewStats,
  patchUserActivity,
} from '../utils/review-profile-cache'
import { applyReviewCreated, applyReviewRatingChanged } from '../utils/review-stats'
import { patchMyReviewStats, setMediaStateReview } from '../utils/review-stats-cache'

export const useUpsertReviewMutation = () => {
  const user = useAuthStore((state) => state.user)

  return useMutation({
    mutationKey: ['upsert-review'],
    mutationFn: ({ previousReview: _, ...body }: UpsertReviewVariables) =>
      reviewApi.upsertReview(body),
    onSuccess: (data, variables, _, context) => {
      const mediaState = context.client.getQueryData<MediaStateResponse>(
        QUERIES_KEYS.mediaState({
          mediaType: data.media.mediaType,
          externalId: data.media.externalId,
        }),
      )
      const previousReview =
        variables.previousReview !== undefined
          ? variables.previousReview
          : (mediaState?.review ?? null)

      if (!previousReview) {
        patchMyReviewStats(context.client, (stats) =>
          applyReviewCreated(stats, {
            mediaType: data.media.mediaType,
            rating: data.rating,
          }),
        )
      } else if (previousReview.rating !== data.rating) {
        patchMyReviewStats(context.client, (stats) =>
          applyReviewRatingChanged(stats, {
            fromRating: previousReview.rating,
            toRating: data.rating,
          }),
        )
      }

      const author = user
        ? {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl,
          }
        : null

      setMediaStateReview(context.client, data)
      removePlannedItemByMediaFromCache(context.client, data.media)
      upsertReviewInListCaches(context.client, data, author)
      upsertReviewInFeedCaches(context.client, data, author, user?.username, !previousReview)

      if (user?.username) {
        if (!previousReview) {
          patchUserActivity(context.client, user.username, (activity) =>
            bumpUserActivity(activity, data.createdAt, 1),
          )
          patchProfileReviewStats(context.client, user.username, (profile) =>
            applyProfileReviewCreated(profile, {
              mediaType: data.media.mediaType,
              rating: data.rating,
            }),
          )
        } else if (previousReview.rating !== data.rating) {
          patchProfileReviewStats(context.client, user.username, (profile) =>
            applyProfileRatingChanged(profile, {
              fromRating: previousReview.rating,
              toRating: data.rating,
            }),
          )
        }
      }
    },
  })
}
