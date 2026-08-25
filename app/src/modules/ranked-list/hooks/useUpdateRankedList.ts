import { useMutation } from '@tanstack/react-query'

import { rankedListApi } from '../api/ranked-list.api'
import type { UpdateRankedListVariables } from '../types/ranked-list.types'
import { updateRankedListInCache } from '../utils/ranked-list-cache'

export const useUpdateRankedList = () => {
  return useMutation({
    mutationKey: ['update-ranked-list'],
    mutationFn: ({ listId, title }: UpdateRankedListVariables) =>
      rankedListApi.updateList(listId, { title }),
    onSuccess: (data, _variables, _onMutateResult, context) => {
      updateRankedListInCache(context.client, data)
    },
  })
}
