import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { rankedListApi } from '../api/ranked-list.api'
import type { DeleteRankedItemVariables, RankedListResponse } from '../types/ranked-list.types'
import { optimisticDeleteItem } from '../utils/ranked-list-cache'

export const useDeleteRankedItem = () => {
  return useMutation({
    mutationKey: ['delete-ranked-item'],
    mutationFn: ({ listId, itemId }: DeleteRankedItemVariables) =>
      rankedListApi.deleteItem(listId, itemId),
    onMutate: async (variables, context) => {
      await context.client.cancelQueries({ queryKey: QUERIES_KEYS.RANKED_LISTS })

      const previous = context.client.getQueryData<RankedListResponse>(QUERIES_KEYS.RANKED_LISTS)

      context.client.setQueryData<RankedListResponse>(
        QUERIES_KEYS.RANKED_LISTS,
        optimisticDeleteItem(previous, variables.listId, variables.itemId),
      )

      return { previous }
    },
    onError: (_error, _variables, onMutateResult, context) => {
      if (onMutateResult?.previous) {
        context.client.setQueryData(QUERIES_KEYS.RANKED_LISTS, onMutateResult.previous)
      }
    },
  })
}
