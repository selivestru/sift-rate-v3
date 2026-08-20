import { Body, Controller, Get, HttpCode, MessageEvent, Post, Query, Sse } from '@nestjs/common'
import { SkipThrottle } from '@nestjs/throttler'

import { MarkReadDto } from './dto/mark-read.dto'
import {
  NotificationsStreamService,
  SSE_HEARTBEAT_INTERVAL_MS,
} from './notifications-stream.service'
import { NotificationsService } from './notifications.service'
import { interval, map, merge, Observable } from 'rxjs'
import { CurrentUser } from '~/common/decorators/current-user.decorator'
import { PaginationCursor } from '~/common/types/pagination-cursor.types'

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly stream: NotificationsStreamService,
  ) {}

  @SkipThrottle()
  @Sse('stream')
  streamNotifications(
    @CurrentUser('userId') userId: string,
    @CurrentUser('sessionId') sessionId: string,
  ): Observable<MessageEvent> {
    return merge(
      this.stream.subscribe(userId, sessionId),
      interval(SSE_HEARTBEAT_INTERVAL_MS).pipe(map(() => ({ type: 'ping', data: '' }))),
    )
  }

  @Get()
  getNotifications(@CurrentUser('userId') userId: string, @Query() query: PaginationCursor) {
    return this.notificationsService.getNotifications(userId, query.cursor)
  }

  @Get('unread-count')
  getUnreadCount(@CurrentUser('userId') userId: string) {
    return this.notificationsService.unreadCount(userId)
  }

  @Post('read')
  @HttpCode(204)
  async markRead(@CurrentUser('userId') userId: string, @Body() dto: MarkReadDto) {
    await this.notificationsService.markRead(userId, dto.notificationIds)
  }

  @Post('read-all')
  @HttpCode(204)
  async markAllRead(@CurrentUser('userId') userId: string) {
    await this.notificationsService.markAllRead(userId)
  }
}
