import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
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

    try {
      const user = await this.userService.findById(userId)

      request.user = {
        userId: user.id,
        email: user.email,
        username: user.username,
        subscription: user.subscription,
      }

      return true
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException()
      }

      throw error
    }
  }
}
