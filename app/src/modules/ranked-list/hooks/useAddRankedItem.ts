import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { rankedListApi } from '../api/ranked-list.api'
import type { AddRankedItemVariables, RankedListResponse } from '../types/ranked-list.types'
import { createTempId, optimisticAddItem, reconcileAddItem } from '../utils/ranked-list-cache'

export const useAddRankedItem = () => {
  return useMutation({
    mutationKey: ['add-ranked-item'],
    mutationFn: ({ listId, mediaId }: AddRankedItemVariables) =>
      rankedListApi.addItem(listId, mediaId),
    onMutate: async (variables, context) => {
      await context.client.cancelQueries({ queryKey: QUERIES_KEYS.rankedLists })

      const previous = context.client.getQueryData<RankedListResponse>(QUERIES_KEYS.rankedLists)
      const tempId = createTempId()

      context.client.setQueryData<RankedListResponse>(
        QUERIES_KEYS.rankedLists,
        optimisticAddItem(previous, {
          tempId,
          listId: variables.listId,
          mediaId: variables.mediaId,
          media: variables.media,
        }),
      )

      return { previous, tempId }
    },
    onError: (_error, _variables, onMutateResult, context) => {
      if (onMutateResult?.previous) {
        context.client.setQueryData(QUERIES_KEYS.rankedLists, onMutateResult.previous)
      }
    },
    onSuccess: (server, variables, onMutateResult, context) => {
      if (!onMutateResult?.tempId) return

      context.client.setQueryData<RankedListResponse>(QUERIES_KEYS.rankedLists, (prev) =>
        reconcileAddItem(prev, variables.listId, onMutateResult.tempId, server),
      )
    },
  })
}
