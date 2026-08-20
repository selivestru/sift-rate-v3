import { useSuspenseQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { profileApi } from '../api/profile.api'

export const useGetUserActivityQuery = (username: string) => {
  return useSuspenseQuery({
    queryKey: QUERIES_KEYS.USER_ACTIVITY(username),
    queryFn: () => profileApi.getUserActivity(username),
  })
}
