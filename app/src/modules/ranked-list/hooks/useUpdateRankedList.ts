import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { rankedListApi } from '../api/ranked-list.api'
import type { UpdateRankedListVariables } from '../types/ranked-list.types'
import {
  applyOptimisticUpdateList,
  applyReconcileUpdateList,
  getRankedListsCache,
  restoreRankedListsCache,
} from '../utils/ranked-list-cache'

export const useUpdateRankedList = (onClose: () => void) => {
  return useMutation({
    mutationKey: ['update-ranked-list'],
    mutationFn: ({ listId, title }: UpdateRankedListVariables) =>
      rankedListApi.updateList(listId, { title }),
    onMutate: async (variables, context) => {
      await context.client.cancelQueries({ queryKey: QUERIES_KEYS.rankedLists })

      const previous = getRankedListsCache(context.client)

      applyOptimisticUpdateList(context.client, previous, variables.listId, {
        title: variables.title,
      })

      onClose()

      return { previous }
    },
    onError: (_error, _variables, onMutateResult, context) => {
      restoreRankedListsCache(context.client, onMutateResult?.previous)
    },
    onSuccess: (server, _variables, _onMutateResult, context) => {
      applyReconcileUpdateList(context.client, server)
    },
  })
}
