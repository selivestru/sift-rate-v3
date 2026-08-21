import { useQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import { useAuthStore } from '~/modules/auth'

import { notificationsApi } from '../api/notifications.api'

export const useGetUnreadCountQuery = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return useQuery({
    queryKey: QUERIES_KEYS.notificationsUnreadCount,
    queryFn: notificationsApi.getUnreadCount,
    enabled: isAuthenticated,
  })
}
