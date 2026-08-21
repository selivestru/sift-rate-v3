import { useSuspenseQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { profileApi } from '../api/profile.api'

export const useGetUserProfileQuery = (username: string) => {
  return useSuspenseQuery({
    queryKey: QUERIES_KEYS.profile(username),
    queryFn: () => profileApi.getProfile(username),
  })
}
