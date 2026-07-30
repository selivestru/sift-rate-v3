import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { Request } from 'express'
import { IS_PUBLIC_KEY } from '~/common/decorators/public.decorator'
import { SessionService } from '~/modules/session/session.service'
import { UserService } from '~/modules/user/user.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const req = context.switchToHttp().getRequest<Request>()
    const userId = req.session?.userId

    if (!userId) {
      throw new ForbiddenException()
    }

    try {
      const user = await this.userService.findById(userId)

      if (!user.isVerified) {
        await this.sessionService.destroy(req)
        throw new ForbiddenException({
          message: 'Please verify your email before logging in',
          code: 'EMAIL_NOT_VERIFIED',
        })
      }

      req.user = {
        userId: user.id,
        email: user.email,
        username: user.username,
        subscription: user.subscription,
      }

      return true
    } catch (error) {
      if (error instanceof NotFoundException) {
        await this.sessionService.destroy(req)
        throw new ForbiddenException()
      }

      throw error
    }
  }
}
