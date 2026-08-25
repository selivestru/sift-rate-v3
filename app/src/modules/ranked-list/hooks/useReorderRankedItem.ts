import { useMutation } from '@tanstack/react-query'

import { rankedListApi } from '../api/ranked-list.api'
import type { ReorderRankedItemVariables } from '../types/ranked-list.types'
import { reorderRankedItemInCache } from '../utils/ranked-list-cache'

export const useReorderRankedItem = () => {
  return useMutation({
    mutationKey: ['reorder-ranked-item'],
    mutationFn: ({ listId, itemId, position }: ReorderRankedItemVariables) => {
      return rankedListApi.reorderItem(listId, itemId, { position })
    },
    onSuccess: (data, _variables, _onMutateResult, context) => {
      reorderRankedItemInCache(context.client, data)
    },
  })
}
