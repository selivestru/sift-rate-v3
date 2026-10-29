import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { plannedApi } from '../api/planned.api'

export const useAddToPlannedList = () => {
  return useMutation({
    mutationKey: ['add-to-planned-list'],
    mutationFn: plannedApi.addToPlannedList,
    onSuccess: (data, _, __, context) =>
      Promise.all([
        context.client.invalidateQueries({ queryKey: QUERIES_KEYS.plannedList }),
        context.client.invalidateQueries({ queryKey: QUERIES_KEYS.mediaState(data.media) }),
      ]),
  })
}
