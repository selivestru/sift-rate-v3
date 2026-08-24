import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { rankedListApi } from '../api/ranked-list.api'
import type { AddRankedItemVariables } from '../types/ranked-list.types'
import {
  applyOptimisticAddItem,
  applyReconcileAddItem,
  createTempId,
  getRankedListsCache,
  restoreRankedListsCache,
} from '../utils/ranked-list-cache'

export const useAddRankedItem = () => {
  return useMutation({
    mutationKey: ['add-ranked-item'],
    mutationFn: ({ listId, mediaId }: AddRankedItemVariables) =>
      rankedListApi.addItem(listId, mediaId),
    onMutate: async (variables, context) => {
      await context.client.cancelQueries({ queryKey: QUERIES_KEYS.rankedLists })

      const previous = getRankedListsCache(context.client)
      const tempId = createTempId()

      applyOptimisticAddItem(context.client, previous, {
        tempId,
        listId: variables.listId,
        mediaId: variables.mediaId,
        media: variables.media,
      })

      return { previous, tempId }
    },
    onError: (_error, _variables, onMutateResult, context) => {
      restoreRankedListsCache(context.client, onMutateResult?.previous)
    },
    onSuccess: (server, variables, onMutateResult, context) => {
      if (!onMutateResult?.tempId) return

      applyReconcileAddItem(context.client, variables.listId, onMutateResult.tempId, server)
    },
  })
}
