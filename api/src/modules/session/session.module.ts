import { Global, Module } from '@nestjs/common'

import { SessionMiddlewareService } from './session.middleware'
import { SessionService } from './session.service'

@Global()
@Module({
  providers: [SessionMiddlewareService, SessionService],
  exports: [SessionMiddlewareService, SessionService],
})
export class SessionModule {}
