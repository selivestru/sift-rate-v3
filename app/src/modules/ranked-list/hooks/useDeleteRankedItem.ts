import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { rankedListApi } from '../api/ranked-list.api'
import type { DeleteRankedItemVariables } from '../types/ranked-list.types'
import {
  applyOptimisticDeleteItem,
  getRankedListsCache,
  restoreRankedListsCache,
} from '../utils/ranked-list-cache'

export const useDeleteRankedItem = () => {
  return useMutation({
    mutationKey: ['delete-ranked-item'],
    mutationFn: ({ listId, itemId }: DeleteRankedItemVariables) =>
      rankedListApi.deleteItem(listId, itemId),
    onMutate: async (variables, context) => {
      await context.client.cancelQueries({ queryKey: QUERIES_KEYS.rankedLists })

      const previous = getRankedListsCache(context.client)

      applyOptimisticDeleteItem(context.client, previous, variables.listId, variables.itemId)

      return { previous }
    },
    onError: (_error, _variables, onMutateResult, context) => {
      restoreRankedListsCache(context.client, onMutateResult?.previous)
    },
  })
}
