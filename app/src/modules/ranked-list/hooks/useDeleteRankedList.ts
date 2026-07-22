import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { rankedListApi } from '../api/ranked-list.api'
import type { RankedListResponse } from '../types/ranked-list.types'
import { optimisticDeleteList } from '../utils/ranked-list-cache'

export const useDeleteRankedList = () => {
  return useMutation({
    mutationKey: ['delete-ranked-list'],
    mutationFn: (listId: string) => rankedListApi.deleteList(listId),
    onMutate: async (listId, context) => {
      await context.client.cancelQueries({ queryKey: QUERIES_KEYS.RANKED_LISTS })

      const previous = context.client.getQueryData<RankedListResponse>(QUERIES_KEYS.RANKED_LISTS)

      context.client.setQueryData<RankedListResponse>(
        QUERIES_KEYS.RANKED_LISTS,
        optimisticDeleteList(previous, listId),
      )

      return { previous }
    },
    onError: (_error, _listId, onMutateResult, context) => {
      if (onMutateResult?.previous) {
        context.client.setQueryData(QUERIES_KEYS.RANKED_LISTS, onMutateResult.previous)
      }
    },
  })
}
