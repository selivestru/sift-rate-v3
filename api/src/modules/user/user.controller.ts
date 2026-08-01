import { Body, Controller, Patch } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { UpdateDisplayNameDto } from './dto/update-display-name.dto'
import { UpdateUsernameDto } from './dto/update-username.dto'
import { UserService } from './user.service'
import { EnvConfig } from '~/app/config/env.config'
import { CurrentUser } from '~/common/decorators/current-user.decorator'

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly config: ConfigService<EnvConfig, true>,
  ) {}

  @Patch('display-name')
  updateDisplayName(@CurrentUser('userId') userId: string, @Body() dto: UpdateDisplayNameDto) {
    return this.userService.updateDisplayName(userId, dto.displayName)
  }

  @Patch('username')
  updateUsername(@CurrentUser('userId') userId: string, @Body() dto: UpdateUsernameDto) {
    return this.userService.updateUsername(userId, dto.username)
  }
}
