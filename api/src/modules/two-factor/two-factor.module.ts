import { Global, Module } from '@nestjs/common'

import { TwoFactorController } from './two-factor.controller'
import { TwoFactorService } from './two-factor.service'

@Global()
@Module({
  controllers: [TwoFactorController],
  providers: [TwoFactorService],
  exports: [TwoFactorService],
})
export class TwoFactorModule {}
