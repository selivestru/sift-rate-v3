import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { seconds, Throttle } from '@nestjs/throttler'

import { AuthService } from './auth.service'
import { CompleteProfileDto } from './dto/complete-profile.dto'
import type { Request, Response } from 'express'
import { EnvConfig } from '~/app/config/env.config'
import { CurrentUser } from '~/common/decorators/current-user.decorator'
import { Public } from '~/common/decorators/public.decorator'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService<EnvConfig, true>,
  ) {}

  @Put('/complete-profile')
  completeProfile(@CurrentUser('userId') userId: string, @Body() dto: CompleteProfileDto) {
    return this.authService.completeProfile(userId, dto)
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: seconds(60) } })
  @Get('google/url')
  getGoogleAuthUrl() {
    return this.authService.getGoogleAuthUrl()
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: seconds(60) } })
  @Get('google/callback')
  async googleCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Query('code') code?: string,
    @Query('state') state?: string,
  ) {
    const origin = this.config.get('ORIGIN', { infer: true })

    if (!code || !state) {
      return res.redirect(`${origin}/auth/google/callback?status=google_auth_failed`)
    }

    try {
      await this.authService.loginWithGoogle(req, res, code, state)

      return res.redirect(`${origin}/auth/google/callback?status=success`)
    } catch (error) {
      const errorCode =
        error instanceof HttpException && error.getStatus() === 409
          ? 'email_taken'
          : 'google_auth_failed'

      return res.redirect(`${origin}/auth/google/callback?status=${errorCode}`)
    }
  }

  @Get('me')
  me(@CurrentUser('userId') userId: string) {
    return this.authService.me(userId)
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req, res)
  }
}
