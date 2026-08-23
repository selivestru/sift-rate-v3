import { useQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import { useAuthStore } from '~/modules/auth'

import { followApi } from '../api/follow.api'

export const useGetFollowRequestsCountQuery = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return useQuery({
    queryKey: QUERIES_KEYS.followRequestsCount,
    queryFn: followApi.getFollowRequestsCount,
    enabled: isAuthenticated,
  })
}
