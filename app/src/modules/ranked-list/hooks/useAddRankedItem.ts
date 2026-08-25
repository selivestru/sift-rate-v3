import { useMutation } from '@tanstack/react-query'

import { rankedListApi } from '../api/ranked-list.api'
import type { AddRankedItemVariables } from '../types/ranked-list.types'
import { addRankedItemToCache } from '../utils/ranked-list-cache'

export const useAddRankedItem = () => {
  return useMutation({
    mutationKey: ['add-ranked-item'],
    mutationFn: ({ listId, mediaId }: AddRankedItemVariables) =>
      rankedListApi.addItem(listId, mediaId),
    onSuccess: (data, _variables, _onMutateResult, context) => {
      addRankedItemToCache(context.client, data)
    },
  })
}
