import { BadRequestException, Injectable } from '@nestjs/common'

import { MediaByIdParamsDto } from './dto/media-by-id.params'
import { SearchMediaQueryDto } from './dto/search-media.query'
import { AlbumService } from './services/album.service'
import { BookService } from './services/book.service'
import { GameService } from './services/game.service'
import { MovieService } from './services/movie.service'
import { TrackService } from './services/track.service'
import { TvShowService } from './services/tv_show.service'
import { MediaType } from '~/generated/prisma/enums'

@Injectable()
export class MediaService {
  constructor(
    private readonly movieService: MovieService,
    private readonly tvShowService: TvShowService,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly gameService: GameService,
    private readonly bookService: BookService,
  ) {}

  searchMedia(mediaType: MediaType, query: SearchMediaQueryDto) {
    switch (mediaType) {
      case MediaType.MOVIE:
        return this.movieService.search(query)
      case MediaType.TV_SHOW:
        return this.tvShowService.search(query)
      case MediaType.TRACK:
        return this.trackService.search(query)
      case MediaType.ALBUM:
        return this.albumService.search(query)
      case MediaType.GAME:
        return this.gameService.search(query)
      case MediaType.BOOK:
        return this.bookService.search(query)
      default:
        throw new BadRequestException('Invalid media type')
    }
  }

  getMediaById({ mediaType, id }: MediaByIdParamsDto) {
    switch (mediaType) {
      case MediaType.MOVIE:
        return this.movieService.getById(id)
      case MediaType.TV_SHOW:
        return this.tvShowService.getById(id)
      case MediaType.TRACK:
        return this.trackService.getById(id)
      case MediaType.ALBUM:
        return this.albumService.getById(id)
      case MediaType.GAME:
        return this.gameService.getById(id)
      case MediaType.BOOK:
        return this.bookService.getById(id)
      default:
        throw new BadRequestException('Invalid media type')
    }
  }
}
