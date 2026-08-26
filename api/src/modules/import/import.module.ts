import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'

import { IMDB_IMPORT_QUEUE } from './constants/import-queue'
import { ImportController } from './import.controller'
import { ImportProcessor } from './import.processor'
import { ImportService } from './import.service'
import { TmdbFindService } from './services/tmdb-find.service'

@Module({
  imports: [
    BullModule.registerQueue({
      name: IMDB_IMPORT_QUEUE,
    }),
  ],
  controllers: [ImportController],
  providers: [ImportService, ImportProcessor, TmdbFindService],
})
export class ImportModule {}
