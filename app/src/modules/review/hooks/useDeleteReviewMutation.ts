import { useMutation } from '@tanstack/react-query'

import { useAuthStore } from '~/modules/auth'

import { reviewApi } from '../api/review.api'
import type { DeleteReviewVariables } from '../types/review.types'
import { removeReviewFromFeedCaches, removeReviewFromListCaches } from '../utils/review-list-cache'
import {
  applyProfileReviewDeleted,
  bumpUserActivity,
  patchProfileReviewStats,
  patchUserActivity,
} from '../utils/review-profile-cache'
import { applyReviewDeleted } from '../utils/review-stats'
import { clearMediaStateReview, patchMyReviewStats } from '../utils/review-stats-cache'

export const useDeleteReviewMutation = () => {
  const user = useAuthStore((state) => state.user)

  return useMutation({
    mutationKey: ['delete-review'],
    mutationFn: ({ id }: DeleteReviewVariables) => reviewApi.deleteReview({ id }),
    onSuccess: (data, _variables, _, context) => {
      patchMyReviewStats(context.client, (stats) =>
        applyReviewDeleted(stats, {
          mediaType: data.media.mediaType,
          rating: data.rating,
        }),
      )
      clearMediaStateReview(context.client, data.media)
      removeReviewFromListCaches(context.client, data)
      removeReviewFromFeedCaches(context.client, data, user?.username)

      if (user?.username) {
        patchUserActivity(context.client, user.username, (activity) =>
          bumpUserActivity(activity, data.createdAt, -1),
        )
        patchProfileReviewStats(context.client, user.username, (profile) =>
          applyProfileReviewDeleted(profile, {
            mediaType: data.media.mediaType,
            rating: data.rating,
          }),
        )
      }
    },
  })
}
