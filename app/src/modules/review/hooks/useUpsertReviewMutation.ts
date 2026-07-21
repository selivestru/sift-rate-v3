import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import type { MediaStateResponse } from '~/modules/discover'

import { reviewApi } from '../api/review.api'

export const useUpsertReviewMutation = () => {
  return useMutation({
    mutationKey: ['upsert-review'],
    mutationFn: reviewApi.upsertReview,
    onSuccess: (data, __, ___, context) => {
      const { media } = data

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
