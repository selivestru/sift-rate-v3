import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { notificationsApi } from '../api/notifications.api'
import type { NotificationUnreadCount, NotificationsResponse } from '../types/notification.types'

export const useMarkAllReadMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['mark-all-notifications-read'],
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => {
      const readAt = new Date().toISOString()

      queryClient.setQueryData<InfiniteData<NotificationsResponse>>(
        QUERIES_KEYS.notifications,
        (prev) => {
          if (!prev) return prev

          return {
            ...prev,
            pages: prev.pages.map((page) => ({
              ...page,
              data: page.data.map((notification) => ({ ...notification, readAt })),
            })),
          }
        },
      )

      queryClient.setQueryData<NotificationUnreadCount>(
        QUERIES_KEYS.notificationsUnreadCount,
        () => {
          return { count: 0 }
        },
      )
    },
  })
}
