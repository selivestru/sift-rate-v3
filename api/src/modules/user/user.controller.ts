import { Body, Controller, Put } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

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

  @Put('username')
  updateUsername(@CurrentUser('userId') userId: string, @Body() dto: UpdateUsernameDto) {
    return this.userService.updateUsername(userId, dto.username)
  }
}
