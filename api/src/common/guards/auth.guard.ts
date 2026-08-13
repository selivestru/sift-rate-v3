import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { Request, Response } from 'express'
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
    const res = context.switchToHttp().getResponse<Response>()
    const userId = req.session?.userId

    if (!userId) {
      throw new ForbiddenException()
    }

    try {
      const user = await this.userService.findById(userId)

      if (!user.isVerified) {
        await this.sessionService.revokeCurrent(req, res)
        throw new ForbiddenException({
          message: 'Please verify your email before logging in',
          code: 'EMAIL_NOT_VERIFIED',
        })
      }

      req.user = {
        sessionId: req.session.id,
        userId: user.id,
        email: user.email,
        username: user.username,
        subscription: user.subscription,
      }

      return true
    } catch (error) {
      if (error instanceof NotFoundException) {
        await this.sessionService.revokeCurrent(req, res)
        throw new ForbiddenException()
      }

      throw error
    }
  }
}
