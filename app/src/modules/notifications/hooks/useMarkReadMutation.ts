import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { notificationsApi } from '../api/notifications.api'
import type { NotificationUnreadCount, NotificationsResponse } from '../types/notification.types'

export const useMarkReadMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['mark-notifications-read'],
    mutationFn: notificationsApi.markRead,
    onSuccess: (_, notificationIds) => {
      const readAt = new Date().toISOString()

      queryClient.setQueryData<InfiniteData<NotificationsResponse>>(
        QUERIES_KEYS.notifications,
        (prev) => {
          if (!prev) return prev

          const ids = new Set(notificationIds)

          return {
            ...prev,
            pages: prev.pages.map((page) => ({
              ...page,
              data: page.data.map((notification) =>
                ids.has(notification.id) ? { ...notification, readAt } : notification,
              ),
            })),
          }
        },
      )

      queryClient.setQueryData<NotificationUnreadCount>(
        QUERIES_KEYS.notificationsUnreadCount,
        (prev) => {
          if (!prev) return prev

          return { count: Math.max(0, prev.count - notificationIds.length) }
        },
      )
    },
  })
}
