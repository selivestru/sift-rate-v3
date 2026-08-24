import type { InfiniteData, QueryClient } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import type {
  NotificationDto,
  NotificationUnreadCount,
  NotificationsResponse,
} from '../types/notification.types'

export const prependNotificationToCache = (
  queryClient: QueryClient,
  notification: NotificationDto,
) => {
  queryClient.setQueryData<InfiniteData<NotificationsResponse>>(
    QUERIES_KEYS.notifications,
    (prev) => {
      if (!prev) return prev

      return {
        ...prev,
        pages: prev.pages.map((page, index) => {
          if (index !== 0) return page

          return {
            ...page,
            data: [notification, ...page.data],
          }
        }),
      }
    },
  )

  queryClient.setQueryData<NotificationUnreadCount>(
    QUERIES_KEYS.notificationsUnreadCount,
    (prev) => {
      if (!prev) return prev

      return { count: prev.count + 1 }
    },
  )
}

export const markAllNotificationsReadInCache = (queryClient: QueryClient, readAt: string) => {
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

  queryClient.setQueryData<NotificationUnreadCount>(QUERIES_KEYS.notificationsUnreadCount, () => {
    return { count: 0 }
  })
}

export const markNotificationsReadInCache = (
  queryClient: QueryClient,
  notificationIds: string[],
  readAt: string,
) => {
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
}

export const removeNotificationsFromCache = (
  queryClient: QueryClient,
  notificationIds: string[],
) => {
  const ids = new Set(notificationIds)

  const notifications = queryClient.getQueryData<InfiniteData<NotificationsResponse>>(
    QUERIES_KEYS.notifications,
  )

  let removedUnread = 0

  if (notifications) {
    for (const page of notifications.pages) {
      for (const item of page.data) {
        if (ids.has(item.id) && item.readAt === null) {
          removedUnread++
        }
      }
    }
  } else {
    removedUnread = notificationIds.length
  }

  queryClient.setQueryData<InfiniteData<NotificationsResponse>>(
    QUERIES_KEYS.notifications,
    (prev) => {
      if (!prev) return prev

      return {
        ...prev,
        pages: prev.pages.map((page) => ({
          ...page,
          data: page.data.filter((item) => !ids.has(item.id)),
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
