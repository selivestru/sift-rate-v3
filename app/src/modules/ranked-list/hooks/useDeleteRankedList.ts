import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { rankedListApi } from '../api/ranked-list.api'
import {
  applyOptimisticDeleteList,
  getRankedListsCache,
  restoreRankedListsCache,
} from '../utils/ranked-list-cache'

export const useDeleteRankedList = () => {
  return useMutation({
    mutationKey: ['delete-ranked-list'],
    mutationFn: (listId: string) => rankedListApi.deleteList(listId),
    onMutate: async (listId, context) => {
      await context.client.cancelQueries({ queryKey: QUERIES_KEYS.rankedLists })

      const previous = getRankedListsCache(context.client)

      applyOptimisticDeleteList(context.client, previous, listId)

      return { previous }
    },
    onError: (_error, _listId, onMutateResult, context) => {
      restoreRankedListsCache(context.client, onMutateResult?.previous)
    },
  })
}
