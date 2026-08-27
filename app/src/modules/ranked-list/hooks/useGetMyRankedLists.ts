import { useSuspenseQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { rankedListApi } from '../api/ranked-list.api'

export const useGetMyRankedLists = () => {
  return useSuspenseQuery({
    queryKey: QUERIES_KEYS.rankedLists,
    queryFn: rankedListApi.getMyRankedLists,
  })
}
