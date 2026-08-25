import { useMutation } from '@tanstack/react-query'

import { rankedListApi } from '../api/ranked-list.api'
import type { DeleteRankedItemVariables } from '../types/ranked-list.types'
import { removeRankedItemFromCache } from '../utils/ranked-list-cache'

export const useDeleteRankedItem = () => {
  return useMutation({
    mutationKey: ['delete-ranked-item'],
    mutationFn: ({ listId, itemId }: DeleteRankedItemVariables) =>
      rankedListApi.deleteItem(listId, itemId),
    onSuccess: (data, _variables, _onMutateResult, context) => {
      removeRankedItemFromCache(context.client, data)
    },
  })
}
