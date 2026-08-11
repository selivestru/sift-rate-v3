import { Global, Module } from '@nestjs/common'

import { FeedController } from './feed.controller'
import { FeedService } from './feed.service'

@Global()
@Module({
  controllers: [FeedController],
  providers: [FeedService],
  exports: [FeedService],
})
export class FeedModule {}
