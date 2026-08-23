import { Global, Module } from '@nestjs/common'

import { FollowModule } from '../follow/follow.module'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Global()
@Module({
  imports: [FollowModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
