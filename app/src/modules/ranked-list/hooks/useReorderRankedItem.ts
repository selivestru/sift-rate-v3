import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { rankedListApi } from '../api/ranked-list.api'
import type { ReorderRankedItemVariables } from '../types/ranked-list.types'

export const useReorderRankedItem = () => {
  return useMutation({
    mutationKey: ['reorder-ranked-item'],
    mutationFn: ({ listId, itemId, position }: ReorderRankedItemVariables) => {
      return rankedListApi.reorderItem(listId, itemId, { position })
    },
    onSuccess: (_data, _variables, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: QUERIES_KEYS.rankedLists }),
  })
}
