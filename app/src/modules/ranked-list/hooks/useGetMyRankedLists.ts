import { useQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { rankedListApi } from '../api/ranked-list.api'

export const useGetMyRankedLists = () => {
  return useQuery({
    queryKey: QUERIES_KEYS.rankedLists,
    queryFn: rankedListApi.getMyRankedLists,
  })
}
