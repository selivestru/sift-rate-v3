import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { Request } from 'express'
import { AuthUser } from '~/modules/user/types/auth-user.types'

export const CurrentUser = createParamDecorator((data: keyof AuthUser, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>()
  const user = request.user

  if (!user) {
    throw new Error('User not found')
  }

  return data ? user[data] : user
})
