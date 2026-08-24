import { useMutation } from '@tanstack/react-query'

import { plannedApi } from '../api/planned.api'
import { addPlannedItemToCache } from '../utils/planned-cache'

export const useAddToPlannedList = () => {
  return useMutation({
    mutationKey: ['add-to-planned-list'],
    mutationFn: plannedApi.addToPlannedList,
    onSuccess: (data, __, ___, context) => {
      addPlannedItemToCache(context.client, data)
    },
  })
}
