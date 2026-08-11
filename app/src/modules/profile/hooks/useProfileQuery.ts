import { useQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { mockProfile } from '../utils/mock-profile'

export const useProfileQuery = (username: string) => {
  return useQuery({
    queryKey: QUERIES_KEYS.PROFILE(username),
    queryFn: () => Promise.resolve(mockProfile),
  })
}
