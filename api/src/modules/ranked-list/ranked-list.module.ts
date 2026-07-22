import { Module } from '@nestjs/common'

import { RankedListController } from './ranked-list.controller'
import { RankedListService } from './ranked-list.service'

@Module({
  controllers: [RankedListController],
  providers: [RankedListService],
})
export class RankedListModule {}
