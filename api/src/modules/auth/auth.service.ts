import { Injectable } from '@nestjs/common'

import { CompleteProfileDto } from './dto/complete-profile.dto'
import { GoogleOAuthService } from './google-oauth.service'
import type { Request, Response } from 'express'
import { safeUser } from '~/common/utils/safeUser'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'
import { SessionService } from '~/modules/session/session.service'
import { SafeUser } from '~/modules/user/types/user.types'
import { UserService } from '~/modules/user/user.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly googleOAuth: GoogleOAuthService,
    private readonly sessionService: SessionService,
    private readonly prismaService: PrismaService,
  ) {}

  async completeProfile(
    userId: string,
    dto: CompleteProfileDto,
  ): Promise<Pick<SafeUser, 'username'>> {
    return this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        username: dto.username,
      },
      select: {
        username: true,
      },
    })
  }

  async getGoogleAuthUrl(): Promise<{ url: string }> {
    return this.googleOAuth.createAuthUrl()
  }

  async loginWithGoogle(req: Request, res: Response, code: string, state: string): Promise<void> {
    const profile = await this.googleOAuth.getProfile(code, state)
    const existing = await this.userService.findByEmail(profile.email)
    const user = existing ?? (await this.userService.createGoogleUser(profile))

    await this.sessionService.create(req, res, user.id)
  }

  async me(userId: string): Promise<{ user: SafeUser }> {
    const user = await this.userService.findById(userId)

    return { user: safeUser(user) }
  }

  async logout(req: Request, res: Response): Promise<void> {
    await this.sessionService.revokeCurrent(req, res)
  }
}
