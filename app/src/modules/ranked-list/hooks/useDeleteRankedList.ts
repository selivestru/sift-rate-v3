import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { rankedListApi } from '../api/ranked-list.api'

export const useDeleteRankedList = () => {
  return useMutation({
    mutationKey: ['delete-ranked-list'],
    mutationFn: (listId: string) => rankedListApi.deleteList(listId),
    onSuccess: (_data, _variables, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: QUERIES_KEYS.rankedLists }),
  })
}
