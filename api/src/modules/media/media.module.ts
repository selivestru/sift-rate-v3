import { Global, Module } from '@nestjs/common'

import { MediaController } from './media.controller'
import { MediaService } from './media.service'
import { AlbumService } from './services/album.service'
import { BookService } from './services/book.service'
import { GameService } from './services/game.service'
import { MovieService } from './services/movie.service'
import { TrackService } from './services/track.service'
import { TvShowService } from './services/tv_show.service'

@Global()
@Module({
  controllers: [MediaController],
  providers: [
    MediaService,
    MovieService,
    TvShowService,
    TrackService,
    AlbumService,
    GameService,
    BookService,
  ],
  exports: [MediaService],
})
export class MediaModule {}
