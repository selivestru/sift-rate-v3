import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { rankedListApi } from '../api/ranked-list.api'
import type { UpdateRankedListVariables } from '../types/ranked-list.types'

export const useUpdateRankedList = () => {
  return useMutation({
    mutationKey: ['update-ranked-list'],
    mutationFn: ({ listId, title }: UpdateRankedListVariables) =>
      rankedListApi.updateList(listId, { title }),
    onSuccess: (_data, _variables, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: QUERIES_KEYS.rankedLists }),
  })
}
