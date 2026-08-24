import type { InfiniteData, QueryClient } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import type { NotificationUnreadCount, NotificationsResponse } from '../types/notification.types'

export const removeNotificationFromCache = (queryClient: QueryClient, notificationId: string) => {
  const notifications = queryClient.getQueryData<InfiniteData<NotificationsResponse>>(
    QUERIES_KEYS.notifications,
  )

  let removedUnread = 0

  if (notifications) {
    for (const page of notifications.pages) {
      for (const item of page.data) {
        if (item.id === notificationId && item.readAt === null) {
          removedUnread++
        }
      }
    }
  }

  queryClient.setQueryData<InfiniteData<NotificationsResponse>>(
    QUERIES_KEYS.notifications,
    (prev) => {
      if (!prev) return prev

      return {
        ...prev,
        pages: prev.pages.map((page) => ({
          ...page,
          data: page.data.filter((item) => item.id !== notificationId),
        })),
      }
    },
  )

  if (removedUnread > 0) {
    queryClient.setQueryData<NotificationUnreadCount>(
      QUERIES_KEYS.notificationsUnreadCount,
      (prev) => {
        if (!prev) return prev

        return { count: Math.max(0, prev.count - removedUnread) }
      },
    )
  }
}
