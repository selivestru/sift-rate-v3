import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { seconds, Throttle } from '@nestjs/throttler'

import { IMDB_IMPORT_MAX_FILE_BYTES } from './constants/imdb-import'
import { ImportJobParamsDto } from './dto/import-job.params'
import { ImportHistoryQueryDto, ImportRowsQueryDto } from './dto/import-query.dto'
import { ImportService } from './import.service'
import { memoryStorage } from 'multer'
import { CurrentUser } from '~/common/decorators/current-user.decorator'

@Controller('import/imdb')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Throttle({ default: { limit: 60, ttl: seconds(60) } })
  @Get('active')
  getActive(@CurrentUser('userId') userId: string) {
    return this.importService.getActiveJob(userId)
  }

  @Throttle({ default: { limit: 60, ttl: seconds(60) } })
  @Get('history')
  getHistory(@CurrentUser('userId') userId: string, @Query() query: ImportHistoryQueryDto) {
    return this.importService.getHistory(userId, query.cursor)
  }

  @Throttle({ default: { limit: 60, ttl: seconds(60) } })
  @Get(':id/rows')
  getRows(
    @CurrentUser('userId') userId: string,
    @Param() params: ImportJobParamsDto,
    @Query() query: ImportRowsQueryDto,
  ) {
    return this.importService.getRows(userId, params.id, query.cursor, query.status)
  }

  @Throttle({ default: { limit: 60, ttl: seconds(60) } })
  @Get(':id')
  getJob(@CurrentUser('userId') userId: string, @Param() params: ImportJobParamsDto) {
    return this.importService.getJob(userId, params.id)
  }

  @Throttle({ default: { limit: 3, ttl: seconds(60) } })
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: IMDB_IMPORT_MAX_FILE_BYTES },
    }),
  )
  create(@CurrentUser('userId') userId: string, @UploadedFile() file?: Express.Multer.File) {
    return this.importService.createImdbImport(userId, file)
  }

  @Throttle({ default: { limit: 3, ttl: seconds(60) } })
  @Post(':id/retry')
  @HttpCode(200)
  retry(@CurrentUser('userId') userId: string, @Param() params: ImportJobParamsDto) {
    return this.importService.retryJob(userId, params.id)
  }
}
