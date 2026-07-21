import { BullModule } from '@nestjs/bullmq'
import { Global, Module } from '@nestjs/common'

import { POSTER_INGEST_QUEUE } from './constants/poster-queue'
import { MediaController } from './media.controller'
import { MediaService } from './media.service'
import { PosterIngestProcessor } from './processors/poster-ingest.processor'
import { AlbumService } from './services/album.service'
import { BookService } from './services/book.service'
import { GameService } from './services/game.service'
import { MovieService } from './services/movie.service'
import { PosterIngestService } from './services/poster-ingest.service'
import { TrackService } from './services/track.service'
import { TvShowService } from './services/tv_show.service'

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: POSTER_INGEST_QUEUE,
    }),
  ],
  controllers: [MediaController],
  providers: [
    MediaService,
    MovieService,
    TvShowService,
    TrackService,
    AlbumService,
    GameService,
    BookService,
    PosterIngestService,
    PosterIngestProcessor,
  ],
  exports: [MediaService],
})
export class MediaModule {}
