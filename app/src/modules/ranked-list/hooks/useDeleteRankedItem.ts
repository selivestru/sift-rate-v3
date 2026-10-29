import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { rankedListApi } from '../api/ranked-list.api'
import type { DeleteRankedItemVariables } from '../types/ranked-list.types'

export const useDeleteRankedItem = () => {
  return useMutation({
    mutationKey: ['delete-ranked-item'],
    mutationFn: ({ listId, itemId }: DeleteRankedItemVariables) =>
      rankedListApi.deleteItem(listId, itemId),
    onSuccess: (_data, _variables, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: QUERIES_KEYS.rankedLists }),
  })
}
