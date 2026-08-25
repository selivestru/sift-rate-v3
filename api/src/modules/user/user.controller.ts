import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common'
import { seconds, Throttle } from '@nestjs/throttler'

import { UpdateDisplayNameDto } from './dto/update-display-name.dto'
import { UpdateUsernameDto } from './dto/update-username.dto'
import { UserActivityQuery } from './dto/user-activity-query.dto'
import { UserService } from './user.service'
import type { Request, Response } from 'express'
import { CurrentUser } from '~/common/decorators/current-user.decorator'
import { Public } from '~/common/decorators/public.decorator'
import { PaginationCursor } from '~/common/types/pagination-cursor.types'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get(':username')
  getUser(@Param('username') username: string) {
    return this.userService.getUserProfile(username)
  }

  @Public()
  @Get(':username/activity')
  getUserActivity(@Param('username') username: string, @Query() query: UserActivityQuery) {
    return this.userService.getUserActivity(username, query.year)
  }

  @Public()
  @Get(':username/feed')
  getUserFeed(@Param('username') username: string, @Query() query?: PaginationCursor) {
    return this.userService.getUserFeed(username, query?.cursor)
  }

  @Patch('display-name')
  updateDisplayName(@CurrentUser('userId') userId: string, @Body() dto: UpdateDisplayNameDto) {
    return this.userService.updateDisplayName(userId, dto.displayName)
  }

  @Patch('username')
  updateUsername(@CurrentUser('userId') userId: string, @Body() dto: UpdateUsernameDto) {
    return this.userService.updateUsername(userId, dto.username)
  }

  @Throttle({ default: { limit: 3, ttl: seconds(60) } })
  @Post('delete')
  @HttpCode(204)
  deleteAccount(
    @CurrentUser('userId') userId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userService.deleteAccount(req, res, userId)
  }
}
