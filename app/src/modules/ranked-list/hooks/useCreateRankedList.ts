import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import { useAuthStore } from '~/modules/auth'

import { rankedListApi } from '../api/ranked-list.api'
import type { RankedListResponse, UpsertRankedListBody } from '../types/ranked-list.types'
import { createTempId, optimisticCreateList, reconcileCreateList } from '../utils/ranked-list-cache'

export const useCreateRankedList = (onSuccess: () => void) => {
  const userId = useAuthStore((state) => state.user?.id)

  return useMutation({
    mutationKey: ['create-ranked-list'],
    mutationFn: (body: UpsertRankedListBody) => rankedListApi.createList(body),
    onMutate: async (body, context) => {
      await context.client.cancelQueries({ queryKey: QUERIES_KEYS.RANKED_LISTS })

      const previous = context.client.getQueryData<RankedListResponse>(QUERIES_KEYS.RANKED_LISTS)
      const tempId = createTempId()

      context.client.setQueryData<RankedListResponse>(
        QUERIES_KEYS.RANKED_LISTS,
        optimisticCreateList(previous, {
          tempId,
          userId: userId!,
          title: body.title,
          visibility: body.visibility,
        }),
      )

      onSuccess()

      return { previous, tempId }
    },
    onError: (_error, _body, onMutateResult, context) => {
      if (onMutateResult?.previous) {
        context.client.setQueryData(QUERIES_KEYS.RANKED_LISTS, onMutateResult.previous)
      }
    },
    onSuccess: (server, _body, onMutateResult, context) => {
      if (!onMutateResult?.tempId) return

      context.client.setQueryData<RankedListResponse>(QUERIES_KEYS.RANKED_LISTS, (prev) =>
        reconcileCreateList(prev, onMutateResult.tempId, server),
      )
    },
  })
}
