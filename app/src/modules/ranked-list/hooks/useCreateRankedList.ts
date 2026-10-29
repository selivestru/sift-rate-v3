import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { rankedListApi } from '../api/ranked-list.api'
import type { UpsertRankedListBody } from '../types/ranked-list.types'

export const useCreateRankedList = () => {
  return useMutation({
    mutationKey: ['create-ranked-list'],
    mutationFn: (body: UpsertRankedListBody) => rankedListApi.createList(body),
    onSuccess: (_data, _variables, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: QUERIES_KEYS.rankedLists }),
  })
}
