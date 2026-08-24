import { useMutation, useQueryClient } from '@tanstack/react-query'

import { notificationsApi } from '../api/notifications.api'
import { markAllNotificationsReadInCache } from '../utils/notifications-cache'

export const useMarkAllReadMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['mark-all-notifications-read'],
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => {
      markAllNotificationsReadInCache(queryClient, new Date().toISOString())
    },
  })
}
