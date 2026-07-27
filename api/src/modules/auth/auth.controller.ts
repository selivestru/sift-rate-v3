import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import type { Request, Response } from 'express'
import { EnvConfig } from '~/app/config/env.config'
import { Public } from '~/common/decorators/public.decorator'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService<EnvConfig, true>,
  ) {}

  @Public()
  @Post('register')
  register(@Req() req: Request, @Body() dto: RegisterDto) {
    return this.authService.register(req, dto)
  }

  @Public()
  @Post('login')
  login(@Req() req: Request, @Body() dto: LoginDto) {
    return this.authService.login(req, dto)
  }

  @Public()
  @Get('google/url')
  getGoogleAuthUrl() {
    return this.authService.getGoogleAuthUrl()
  }

  @Public()
  @Get('google/callback')
  async googleCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Query('code') code?: string,
    @Query('state') state?: string,
  ) {
    const origin = this.config.get('ORIGIN', { infer: true })

    if (!code || !state) {
      return res.redirect(`${origin}/auth/callback?error=google_auth_failed`)
    }

    try {
      await this.authService.loginWithGoogle(req, code, state)

      return res.redirect(`${origin}/auth/callback`)
    } catch (error) {
      const errorCode =
        error instanceof HttpException && error.getStatus() === 409
          ? 'email_taken'
          : 'google_auth_failed'

      return res.redirect(`${origin}/auth/callback?error=${errorCode}`)
    }
  }

  @Get('me')
  me(@Req() req: Request) {
    return this.authService.me(req.session.userId!)
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req, res)
  }
}
