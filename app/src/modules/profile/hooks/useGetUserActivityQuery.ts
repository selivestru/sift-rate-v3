import { useSuspenseQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { profileApi } from '../api/profile.api'

export const useGetUserActivityQuery = (username: string, selectedYear: number) => {
  return useSuspenseQuery({
    queryKey: QUERIES_KEYS.userActivity(username, selectedYear),
    queryFn: () => profileApi.getUserActivity(username, selectedYear),
  })
}
