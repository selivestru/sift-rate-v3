import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { rankedListApi } from '../api/ranked-list.api'
import type { RankedListResponse, ReorderRankedItemVariables } from '../types/ranked-list.types'
import { optimisticReorderItem } from '../utils/ranked-list-cache'

export const useReorderRankedItem = () => {
  return useMutation({
    mutationKey: ['reorder-ranked-item'],
    mutationFn: ({ listId, itemId, position }: ReorderRankedItemVariables) => {
      return rankedListApi.reorderItem(listId, itemId, { position })
    },
    onMutate: async (variables, context) => {
      await context.client.cancelQueries({ queryKey: QUERIES_KEYS.rankedLists })

      const previous = context.client.getQueryData<RankedListResponse>(QUERIES_KEYS.rankedLists)

      context.client.setQueryData<RankedListResponse>(
        QUERIES_KEYS.rankedLists,
        optimisticReorderItem(previous, variables.listId, variables.itemId, variables.position),
      )

      return { previous }
    },
    onError: (_error, _variables, onMutateResult, context) => {
      if (onMutateResult?.previous) {
        context.client.setQueryData(QUERIES_KEYS.rankedLists, onMutateResult.previous)
      }
    },
  })
}
