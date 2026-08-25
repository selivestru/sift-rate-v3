import { useMutation } from '@tanstack/react-query'

import { rankedListApi } from '../api/ranked-list.api'
import { removeRankedListFromCache } from '../utils/ranked-list-cache'

export const useDeleteRankedList = () => {
  return useMutation({
    mutationKey: ['delete-ranked-list'],
    mutationFn: (listId: string) => rankedListApi.deleteList(listId),
    onSuccess: (data, _listId, _onMutateResult, context) => {
      removeRankedListFromCache(context.client, data)
    },
  })
}
