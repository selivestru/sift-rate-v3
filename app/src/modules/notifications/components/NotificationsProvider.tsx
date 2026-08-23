import { useQueryClient, type InfiniteData } from '@tanstack/react-query'
import { useEffect } from 'react'

import { env } from '~/common/constants/env'
import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import { useAuthStore } from '~/modules/auth'

import { notificationSchema } from '../schema/notification.schema'
import type {
  NotificationDto,
  NotificationUnreadCount,
  NotificationsResponse,
} from '../types/notification.types'

const NOTIFICATION_EVENT_NAME = 'notification'

export const NotificationsProvider = ({ children }: React.PropsWithChildren) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isAuthenticated) return

    const source = new EventSource(
      new URL('/api/notifications/stream', env.VITE_BASE_URL).toString(),
      { withCredentials: true },
    )

    source.addEventListener(NOTIFICATION_EVENT_NAME, (event) => {
      try {
        const data = JSON.parse(event.data)

        const result = notificationSchema.safeParse(data)

        if (!result.success) {
          console.warn('Invalid notification payload', result.error)
          return
        }

        const notification = result.data as NotificationDto

        queryClient.setQueryData<InfiniteData<NotificationsResponse>>(
          QUERIES_KEYS.notifications,
          (prev) => {
            if (!prev) return prev

            return {
              ...prev,
              pages: prev.pages.map((page, index) =>
                index === 0
                  ? {
                      ...page,
                      data: page.data.some((item) => item.id === notification.id)
                        ? page.data
                        : [notification, ...page.data],
                    }
                  : page,
              ),
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

        if (notification.type === 'FOLLOW' || notification.type === 'FOLLOW_REQUEST') {
          queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.followRequestsCount })
        }
      } catch (error) {
        console.warn('Failed to parse notification event', error)
      }
    })

    return () => {
      source.close()
    }
  }, [isAuthenticated, queryClient])

  return <>{children}</>
}
