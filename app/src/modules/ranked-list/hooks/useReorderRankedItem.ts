import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { rankedListApi } from '../api/ranked-list.api'
import type { ReorderRankedItemVariables } from '../types/ranked-list.types'
import {
  applyOptimisticReorderItem,
  getRankedListsCache,
  restoreRankedListsCache,
} from '../utils/ranked-list-cache'

export const useReorderRankedItem = () => {
  return useMutation({
    mutationKey: ['reorder-ranked-item'],
    mutationFn: ({ listId, itemId, position }: ReorderRankedItemVariables) => {
      return rankedListApi.reorderItem(listId, itemId, { position })
    },
    onMutate: async (variables, context) => {
      await context.client.cancelQueries({ queryKey: QUERIES_KEYS.rankedLists })

      const previous = getRankedListsCache(context.client)

      applyOptimisticReorderItem(
        context.client,
        previous,
        variables.listId,
        variables.itemId,
        variables.position,
      )

      return { previous }
    },
    onError: (_error, _variables, onMutateResult, context) => {
      restoreRankedListsCache(context.client, onMutateResult?.previous)
    },
  })
}
