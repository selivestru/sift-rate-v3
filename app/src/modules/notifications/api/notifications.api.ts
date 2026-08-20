import { api } from '~/common/api'

import type { NotificationUnreadCount, NotificationsResponse } from '../types/notification.types'

export const notificationsApi = {
  getNotifications: (cursor?: string) => {
    const searchParams = new URLSearchParams()

    if (cursor) {
      searchParams.set('cursor', cursor)
    }

    return api.get<NotificationsResponse>('/notifications', { searchParams }).json()
  },
  getUnreadCount: () => {
    return api.get<NotificationUnreadCount>('/notifications/unread-count').json()
  },
  markRead: (notificationIds: string[]) => {
    return api.post('/notifications/read', { json: { notificationIds } })
  },
  markAllRead: () => {
    return api.post('/notifications/read-all')
  },
}
