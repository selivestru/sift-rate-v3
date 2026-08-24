import { useMutation, useQueryClient } from '@tanstack/react-query'

import { notificationsApi } from '../api/notifications.api'
import { markNotificationsReadInCache } from '../utils/notifications-cache'

export const useMarkReadMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['mark-notifications-read'],
    mutationFn: notificationsApi.markRead,
    onSuccess: (_, notificationIds) => {
      markNotificationsReadInCache(queryClient, notificationIds, new Date().toISOString())
    },
  })
}
