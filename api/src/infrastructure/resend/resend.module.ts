import { BullModule } from '@nestjs/bullmq'
import { Global, Module } from '@nestjs/common'

import { EMAIL_QUEUE } from './constants/email-queue'
import { EmailProcessor } from './email.processor'
import { ResendService } from './resend.service'

@Global()
@Module({
  imports: [BullModule.registerQueue({ name: EMAIL_QUEUE })],
  providers: [ResendService, EmailProcessor],
  exports: [ResendService, BullModule.registerQueue({ name: EMAIL_QUEUE })],
})
export class ResendModule {}
