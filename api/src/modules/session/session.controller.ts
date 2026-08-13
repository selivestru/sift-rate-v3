import { Controller, Delete, Get, Param } from '@nestjs/common'
import { seconds, Throttle } from '@nestjs/throttler'

import { SessionService } from './session.service'
import { CurrentUser } from '~/common/decorators/current-user.decorator'

@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  getSessions(@CurrentUser('userId') userId: string, @CurrentUser('sessionId') sessionId: string) {
    return this.sessionService.getAllForUser(userId, sessionId)
  }

  @Throttle({ default: { limit: 10, ttl: seconds(60) } })
  @Delete()
  revokeAll(@CurrentUser('userId') userId: string, @CurrentUser('sessionId') sessionId: string) {
    return this.sessionService.destroyAllForUser(userId, sessionId)
  }

  @Throttle({ default: { limit: 10, ttl: seconds(60) } })
  @Delete(':sid')
  revoke(
    @CurrentUser('userId') userId: string,
    @CurrentUser('sessionId') sessionId: string,
    @Param('sid') sid: string,
  ) {
    return this.sessionService.revoke(userId, sessionId, sid)
  }
}
