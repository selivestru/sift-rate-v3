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
import { ConfigService } from '@nestjs/config'
import { seconds, Throttle } from '@nestjs/throttler'

import { ChangeEmailDto } from './dto/change-email.dto'
import { ChangePasswordDto } from './dto/change-password.dto'
import { DeleteAccountDto } from './dto/delete-account.dto'
import { UpdateDisplayNameDto } from './dto/update-display-name.dto'
import { UpdateUsernameDto } from './dto/update-username.dto'
import { UserActivityQuery } from './dto/user-activity-query.dto'
import { UserService } from './user.service'
import type { Request, Response } from 'express'
import { EnvConfig } from '~/app/config/env.config'
import { CurrentUser } from '~/common/decorators/current-user.decorator'
import { Public } from '~/common/decorators/public.decorator'
import { TwoFactor } from '~/common/decorators/two-factor.decorator'
import { PaginationCursor } from '~/common/types/pagination-cursor.types'

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly config: ConfigService<EnvConfig, true>,
  ) {}

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
  @Patch('email')
  @TwoFactor()
  changeEmail(@CurrentUser('userId') userId: string, @Body() dto: ChangeEmailDto) {
    return this.userService.changeEmail(userId, dto)
  }

  @Patch('password')
  @TwoFactor()
  changePassword(
    @Req() req: Request,
    @CurrentUser('userId') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(userId, req.session.id, dto)
  }

  @Throttle({ default: { limit: 3, ttl: seconds(60) } })
  @Post('delete')
  @HttpCode(202)
  @TwoFactor()
  requestAccountDeletion(@CurrentUser('userId') userId: string, @Body() dto: DeleteAccountDto) {
    return this.userService.requestAccountDeletion(userId, dto)
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: seconds(60) } })
  @Get('delete-confirm')
  async confirmAccountDeletion(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('token') token?: string,
  ) {
    const origin = this.config.get('ORIGIN', { infer: true })

    if (!token) {
      return res.redirect(`${origin}/auth/callback?status=account_delete_failed`)
    }

    try {
      await this.userService.confirmAccountDeletion(req, res, token)
      return res.redirect(`${origin}/auth/callback?status=account_deleted`)
    } catch {
      return res.redirect(`${origin}/auth/callback?status=account_delete_failed`)
    }
  }
}
