import { useMutation } from '@tanstack/react-query'

import { plannedApi } from '../api/planned.api'
import { removePlannedItemFromCache } from '../utils/planned-cache'

export const useDeletePlannedItem = () => {
  return useMutation({
    mutationKey: ['delete-planned-item'],
    mutationFn: plannedApi.deletePlannedItem,
    onSuccess: (data, __, ___, context) => {
      removePlannedItemFromCache(context.client, data)
    },
  })
}
