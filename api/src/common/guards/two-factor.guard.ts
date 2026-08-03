import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'

import { Request } from 'express'
import { TwoFactorService } from '~/modules/two-factor/two-factor.service'
import { AuthUser } from '~/modules/user/types/auth-user.types'
import { UserService } from '~/modules/user/user.service'

@Injectable()
export class TwoFactorGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly twoFactorService: TwoFactorService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { user: AuthUser }>()
    const userId = req.user.userId

    const user = await this.userService.findById(userId)

    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      return true
    }

    const code = (req.body as { twoFactorCode?: string } | undefined)?.twoFactorCode

    if (!code) {
      throw new UnauthorizedException({
        message: 'Two-factor authentication code is required',
        code: 'TWO_FACTOR_REQUIRED',
      })
    }

    const result = await this.twoFactorService.verifyStoredCode(userId, code)

    if (!result.valid) {
      throw new UnauthorizedException({
        message: 'Invalid two-factor authentication code',
        code: 'INVALID_TWO_FACTOR_CODE',
      })
    }

    return true
  }
}
