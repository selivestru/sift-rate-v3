import { useQueryClient, type InfiniteData } from '@tanstack/react-query'
import { useEffect } from 'react'

import { env } from '~/common/constants/env'
import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import { useAuthStore } from '~/modules/auth'
import type {
  FollowRequest,
  FollowRequestsCount,
  FollowRequestsResponse,
} from '~/modules/profile/types/follow.types'
import { removeFollowRequestFromCache } from '~/modules/profile/utils/update-follow-requests-cache'

import { notificationSchema } from '../schema/notification.schema'
import type {
  NotificationDto,
  NotificationUnreadCount,
  NotificationsResponse,
} from '../types/notification.types'

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

        if (notification.type === 'FOLLOW_REQUEST') {
          const actor = notification.payload

          if (actor.id) {
            queryClient.setQueryData<InfiniteData<FollowRequestsResponse>>(
              QUERIES_KEYS.followRequests,
              (prev) => {
                if (!prev) return prev

                return {
                  ...prev,
                  pages: prev.pages.map((page, index) =>
                    index === 0
                      ? {
                          ...page,
                          data: page.data.some((author) => author.id === actor.id)
                            ? page.data
                            : [
                                { ...actor, notificationId: notification.id } as FollowRequest,
                                ...page.data,
                              ],
                        }
                      : page,
                  ),
                }
              },
            )

            queryClient.setQueryData<FollowRequestsCount>(
              QUERIES_KEYS.followRequestsCount,
              (prev) => {
                if (!prev) return prev

                return { count: prev.count + 1 }
              },
            )
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
        const ids = new Set(data.ids)

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
          removedUnread = data.ids.length
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
