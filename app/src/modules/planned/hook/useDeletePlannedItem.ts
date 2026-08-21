import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import type { MediaStateResponse } from '~/modules/discover'

import { plannedApi } from '../api/planned.api'
import type { PlannedListResponse } from '../types/planned.types'

export const useDeletePlannedItem = () => {
  return useMutation({
    mutationKey: ['delete-planned-item'],
    mutationFn: plannedApi.deletePlannedItem,
    onSuccess: (data, __, ___, context) => {
      context.client.setQueryData<PlannedListResponse>(QUERIES_KEYS.plannedList, (prev) => {
        if (!prev) return prev

        return {
          data: prev.data.filter((item) => item.id !== data.id),
          totalResults: prev.totalResults - 1,
        }
      })

      const { media } = data

      context.client.setQueryData<MediaStateResponse>(
        QUERIES_KEYS.mediaState({ externalId: media.externalId, mediaType: media.mediaType }),
        (prev) => {
          if (!prev) return prev

          return {
            ...prev,
            plannedItem: null,
          }
        },
      )
    },
  })
}
