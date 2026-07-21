import { useQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { plannedApi } from '../api/planned.api'

export const useGetPlannedList = () => {
  return useQuery({
    queryKey: QUERIES_KEYS.PLANNED_LIST,
    queryFn: plannedApi.getPlannedList,
  })
}
