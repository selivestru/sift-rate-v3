import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { rankedListApi } from '../api/ranked-list.api'
import type { RankedListResponse, UpdateRankedListVariables } from '../types/ranked-list.types'
import { optimisticUpdateList, reconcileUpdateList } from '../utils/ranked-list-cache'

export const useUpdateRankedList = (onClose: () => void) => {
  return useMutation({
    mutationKey: ['update-ranked-list'],
    mutationFn: ({ listId, title }: UpdateRankedListVariables) =>
      rankedListApi.updateList(listId, { title }),
    onMutate: async (variables, context) => {
      await context.client.cancelQueries({ queryKey: QUERIES_KEYS.RANKED_LISTS })

      const previous = context.client.getQueryData<RankedListResponse>(QUERIES_KEYS.RANKED_LISTS)

      context.client.setQueryData<RankedListResponse>(
        QUERIES_KEYS.RANKED_LISTS,
        optimisticUpdateList(previous, variables.listId, {
          title: variables.title,
        }),
      )

      onClose()

      return { previous }
    },
    onError: (_error, _variables, onMutateResult, context) => {
      if (onMutateResult?.previous) {
        context.client.setQueryData(QUERIES_KEYS.RANKED_LISTS, onMutateResult.previous)
      }
    },
    onSuccess: (server, _variables, _onMutateResult, context) => {
      context.client.setQueryData<RankedListResponse>(QUERIES_KEYS.RANKED_LISTS, (prev) =>
        reconcileUpdateList(prev, server),
      )
    },
  })
}
