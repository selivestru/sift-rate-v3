import { Injectable, MessageEvent } from '@nestjs/common'

import { NotificationDto } from './types/notification.types'
import { finalize, Observable, Subject } from 'rxjs'
import { NotificationType } from '~/generated/prisma/enums'

export const SSE_EVENT_NAME = 'notification'
export const SSE_DELETE_EVENT_NAME = 'notification-deleted'
export const SSE_HEARTBEAT_INTERVAL_MS = 30_000

@Injectable()
export class NotificationsStreamService {
  private readonly streams = new Map<string, Map<string, Subject<MessageEvent>>>()

  subscribe(userId: string, sessionId: string): Observable<MessageEvent> {
    let userStreams = this.streams.get(userId)

    if (!userStreams) {
      userStreams = new Map()
      this.streams.set(userId, userStreams)
    }

    let subject = userStreams.get(sessionId)

    if (!subject) {
      subject = new Subject<MessageEvent>()
      userStreams.set(sessionId, subject)
    }

    return subject.asObservable().pipe(
      finalize(() => {
        const userStreams = this.streams.get(userId)

        if (!userStreams) return

        const current = userStreams.get(sessionId)

        if (current === subject && !subject.observed) {
          userStreams.delete(sessionId)

          if (userStreams.size === 0) {
            this.streams.delete(userId)
          }
        }
      }),
    )
  }

  emit(userId: string, notification: NotificationDto): void {
    const userStreams = this.streams.get(userId)

    if (!userStreams) return

    const message: MessageEvent = {
      type: SSE_EVENT_NAME,
      data: JSON.stringify(notification),
    }

    for (const subject of userStreams.values()) {
      subject.next(message)
    }
  }

  emitDelete(
    userId: string,
    notificationIds: string[],
    type: NotificationType,
    payload: Record<string, string>,
  ): void {
    const userStreams = this.streams.get(userId)

    if (!userStreams) return

    const message: MessageEvent = {
      type: SSE_DELETE_EVENT_NAME,
      data: JSON.stringify({ ids: notificationIds, type, payload }),
    }

    for (const subject of userStreams.values()) {
      subject.next(message)
    }
  }

  closeSession(sessionId: string): void {
    for (const [userId, userStreams] of this.streams) {
      const subject = userStreams.get(sessionId)

      if (!subject) continue

      subject.complete()
      userStreams.delete(sessionId)

      if (userStreams.size === 0) {
        this.streams.delete(userId)
      }
    }
  }
}
