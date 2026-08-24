import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import { useAuthStore } from '~/modules/auth'

import { rankedListApi } from '../api/ranked-list.api'
import type { UpsertRankedListBody } from '../types/ranked-list.types'
import {
  applyOptimisticCreateList,
  applyReconcileCreateList,
  createTempId,
  getRankedListsCache,
  restoreRankedListsCache,
} from '../utils/ranked-list-cache'

export const useCreateRankedList = (onSuccess: () => void) => {
  const userId = useAuthStore((state) => state.user?.id)

  return useMutation({
    mutationKey: ['create-ranked-list'],
    mutationFn: (body: UpsertRankedListBody) => rankedListApi.createList(body),
    onMutate: async (body, context) => {
      await context.client.cancelQueries({ queryKey: QUERIES_KEYS.rankedLists })

      const previous = getRankedListsCache(context.client)
      const tempId = createTempId()

      applyOptimisticCreateList(context.client, previous, {
        tempId,
        userId: userId!,
        title: body.title,
      })

      onSuccess()

      return { previous, tempId }
    },
    onError: (_error, _body, onMutateResult, context) => {
      restoreRankedListsCache(context.client, onMutateResult?.previous)
    },
    onSuccess: (server, _body, onMutateResult, context) => {
      if (!onMutateResult?.tempId) return

      applyReconcileCreateList(context.client, onMutateResult.tempId, server)
    },
  })
}
