import { Module } from '@nestjs/common'

import { PlannedController } from './planned.controller'
import { PlannedService } from './planned.service'

@Module({
  controllers: [PlannedController],
  providers: [PlannedService],
})
export class PlannedModule {}
