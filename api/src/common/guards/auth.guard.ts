import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { Request } from 'express'
import { IS_PUBLIC_KEY } from '~/common/decorators/public.decorator'
import { UserService } from '~/modules/user/user.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()
    const userId = request.session?.userId

    if (!userId) {
      throw new UnauthorizedException()
    }

    const user = await this.userService.findById(userId)

    if (!user) {
      throw new UnauthorizedException()
    }

    request.user = {
      userId: user.id,
      username: user.username,
      subscription: user.subscription,
    }

    return true
  }
}
