import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { env } from '~/common/constants/env'
import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import { useAuthStore } from '~/modules/auth'
import {
  prependFollowRequestToCache,
  removeFollowRequestFromCache,
  type FollowRequest,
} from '~/modules/profile'

import { notificationSchema } from '../schema/notification.schema'
import type { NotificationDto } from '../types/notification.types'
import {
  prependNotificationToCache,
  removeNotificationsFromCache,
} from '../utils/notifications-cache'

const NOTIFICATION_EVENT_NAME = 'notification'
const NOTIFICATION_DELETED_EVENT_NAME = 'notification-deleted'

export const NotificationsProvider = ({ children }: React.PropsWithChildren) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isAuthenticated) return

    const source = new EventSource(
      new URL('/api/notifications/stream', env.VITE_BASE_URL).toString(),
      { withCredentials: true },
    )
    let hasOpened = false

    source.onopen = () => {
      if (hasOpened) {
        queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.notifications })
        queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.notificationsUnreadCount })
        queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.followRequests })
        queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.followRequestsCount })
      }

      hasOpened = true
    }

    source.onerror = (error) => {
      console.warn('Notification stream error', error)
    }

    source.addEventListener(NOTIFICATION_EVENT_NAME, (event) => {
      try {
        const data = JSON.parse(event.data)

        const result = notificationSchema.safeParse(data)

        if (!result.success) {
          console.warn('Invalid notification payload', result.error)
          return
        }

        const notification = result.data as NotificationDto

        prependNotificationToCache(queryClient, notification)

        if (notification.type === 'FOLLOW_REQUEST') {
          const actor = notification.payload

          if (actor.id) {
            prependFollowRequestToCache(queryClient, {
              ...actor,
              notificationId: notification.id,
            } as FollowRequest)
          }
        } else if (notification.type === 'FOLLOW_REQUEST_ACCEPTED') {
          const actor = notification.payload

          if (actor.username) {
            queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.profile(actor.username) })
          }
        }
      } catch (error) {
        console.warn('Failed to parse notification event', error)
      }
    })

    source.addEventListener(NOTIFICATION_DELETED_EVENT_NAME, (event) => {
      try {
        const data = JSON.parse(event.data) as {
          ids: string[]
          type: string
          payload: Record<string, string>
        }
        removeNotificationsFromCache(queryClient, data.ids)

        if (data.type === 'FOLLOW_REQUEST' && data.payload.userId) {
          removeFollowRequestFromCache(queryClient, data.payload.userId)
        }
      } catch (error) {
        console.warn('Failed to parse notification deletion event', error)
      }
    })

    return () => {
      source.close()
    }
  }, [isAuthenticated, queryClient])

  return <>{children}</>
}
