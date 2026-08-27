import { useSuspenseQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { plannedApi } from '../api/planned.api'

export const useGetPlannedList = () => {
  return useSuspenseQuery({
    queryKey: QUERIES_KEYS.plannedList,
    queryFn: plannedApi.getPlannedList,
  })
}
