import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { rankedListApi } from '../api/ranked-list.api'
import type { AddRankedItemVariables } from '../types/ranked-list.types'

export const useAddRankedItem = () => {
  return useMutation({
    mutationKey: ['add-ranked-item'],
    mutationFn: ({ listId, mediaId }: AddRankedItemVariables) =>
      rankedListApi.addItem(listId, mediaId),
    onSuccess: (_data, _variables, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: QUERIES_KEYS.rankedLists }),
  })
}
