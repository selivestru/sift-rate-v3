import { useSuspenseInfiniteQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { notificationsApi } from '../api/notifications.api'

export const useGetNotificationsQuery = () => {
  return useSuspenseInfiniteQuery({
    queryKey: QUERIES_KEYS.NOTIFICATIONS,
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => notificationsApi.getNotifications(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
}
