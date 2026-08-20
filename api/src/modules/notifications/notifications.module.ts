import { Global, Module } from '@nestjs/common'

import { NotificationPayloadResolverService } from './notification-payload.resolver'
import { NotificationsStreamService } from './notifications-stream.service'
import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './notifications.service'

@Global()
@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsStreamService, NotificationPayloadResolverService],
  exports: [NotificationsService, NotificationsStreamService],
})
export class NotificationsModule {}
