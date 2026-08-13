import { Global, Module } from '@nestjs/common'

import { SessionController } from './session.controller'
import { SessionMiddlewareService } from './session.middleware'
import { SessionService } from './session.service'

@Global()
@Module({
  controllers: [SessionController],
  providers: [SessionMiddlewareService, SessionService],
  exports: [SessionMiddlewareService, SessionService],
})
export class SessionModule {}
