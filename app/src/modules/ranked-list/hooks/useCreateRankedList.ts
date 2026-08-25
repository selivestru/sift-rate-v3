import { useMutation } from '@tanstack/react-query'

import { rankedListApi } from '../api/ranked-list.api'
import type { UpsertRankedListBody } from '../types/ranked-list.types'
import { addRankedListToCache } from '../utils/ranked-list-cache'

export const useCreateRankedList = () => {
  return useMutation({
    mutationKey: ['create-ranked-list'],
    mutationFn: (body: UpsertRankedListBody) => rankedListApi.createList(body),
    onSuccess: (data, _body, _onMutateResult, context) => {
      addRankedListToCache(context.client, data)
    },
  })
}
