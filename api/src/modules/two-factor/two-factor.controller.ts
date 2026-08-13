import { Body, Controller, Post } from '@nestjs/common'
import { seconds, Throttle } from '@nestjs/throttler'

import { TwoFactorCodeDto } from './dto/two-factor-code.dto'
import { TwoFactorService } from './two-factor.service'
import { CurrentUser } from '~/common/decorators/current-user.decorator'

@Controller('2fa')
export class TwoFactorController {
  constructor(private readonly twoFactorService: TwoFactorService) {}

  @Post('setup')
  setup(@CurrentUser('userId') userId: string, @CurrentUser('email') email: string) {
    return this.twoFactorService.setup(userId, email)
  }

  @Throttle({ default: { limit: 5, ttl: seconds(60) } })
  @Post('verify')
  verify(
    @CurrentUser('sessionId') sessionId: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: TwoFactorCodeDto,
  ) {
    return this.twoFactorService.verify(userId, dto.code, sessionId)
  }

  @Throttle({ default: { limit: 5, ttl: seconds(60) } })
  @Post('disable')
  disable(@CurrentUser('userId') userId: string, @Body() dto: TwoFactorCodeDto) {
    return this.twoFactorService.disable(userId, dto.code)
  }
}
