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
import { seconds, Throttle } from '@nestjs/throttler'

import { AuthService } from './auth.service'
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  ResetPasswordVerifyDto,
} from './dto/forgot-password.dto'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { ResendVerificationDto } from './dto/resend-verification.dto'
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
  @Throttle({ default: { limit: 3, ttl: seconds(60) } })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
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

  @Public()
  @Get('verify')
  async verifyEmail(@Req() req: Request, @Res() res: Response, @Query('token') token?: string) {
    const origin = this.config.get('ORIGIN', { infer: true })

    if (!token) {
      return res.redirect(`${origin}/auth/callback?error=invalid_or_expired`)
    }

    try {
      await this.authService.verifyEmail(req, token)

      return res.redirect(`${origin}/auth/callback`)
    } catch {
      return res.redirect(`${origin}/auth/callback?error=invalid_or_expired`)
    }
  }

  @Public()
  @Throttle({ default: { limit: 3, ttl: seconds(60) } })
  @Post('resend-verification')
  @HttpCode(200)
  resendVerification(@Body() dto: ResendVerificationDto) {
    return this.authService.resendVerification(dto.email)
  }

  @Public()
  @Throttle({ default: { limit: 3, ttl: seconds(60) } })
  @Post('forgot-password')
  @HttpCode(200)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email)
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: seconds(60) } })
  @Post('reset-password/verify')
  @HttpCode(200)
  resetPasswordVerify(@Body() dto: ResetPasswordVerifyDto) {
    return this.authService.resetPasswordVerify(dto.token)
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: seconds(60) } })
  @Post('reset-password')
  @HttpCode(200)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto)
  }
}
