import { Body, Controller, Patch, Req } from '@nestjs/common'
import { seconds, Throttle } from '@nestjs/throttler'

import { ChangeEmailDto } from './dto/change-email.dto'
import { ChangePasswordDto } from './dto/change-password.dto'
import { UpdateDisplayNameDto } from './dto/update-display-name.dto'
import { UpdateUsernameDto } from './dto/update-username.dto'
import { UserService } from './user.service'
import type { Request } from 'express'
import { CurrentUser } from '~/common/decorators/current-user.decorator'
import { TwoFactor } from '~/common/decorators/two-factor.decorator'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
}
