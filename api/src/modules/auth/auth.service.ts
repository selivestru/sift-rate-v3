import { InjectQueue } from '@nestjs/bullmq'
import {
  ConflictException,
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { SessionService } from '../session/session.service'
import { TwoFactorService } from '../two-factor/two-factor.service'
import { SafeUser } from '../user/types/user.types'
import { ResetPasswordDto } from './dto/forgot-password.dto'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { GoogleOAuthService } from './google-oauth.service'
import { argon2id, hash, verify } from 'argon2'
import { Queue } from 'bullmq'
import type { Request, Response } from 'express'
import { createHash, randomBytes } from 'node:crypto'
import { EnvConfig } from '~/app/config/env.config'
import { safeUser } from '~/common/utils/safeUser'
import { AuthMethod } from '~/generated/prisma/client'
import { RedisService } from '~/infrastructure/redis/redis.service'
import {
  EMAIL_QUEUE,
  PASSWORD_RESET_JOB,
  WELCOME_GOOGLE_JOB,
  WELCOME_JOB,
} from '~/infrastructure/resend/constants/email-queue'
import { UserService } from '~/modules/user/user.service'

@Injectable()
export class AuthService {
  private readonly VERIFICATION_TTL = 86_400
  private readonly PASSWORD_RESET_TTL = 3_600
  private readonly RESEND_COOLDOWN_TTL = 60
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly userService: UserService,
    private readonly config: ConfigService<EnvConfig, true>,
    private readonly googleOAuth: GoogleOAuthService,
    private readonly twoFactorService: TwoFactorService,
    private readonly redis: RedisService,
    private readonly sessionService: SessionService,
    @InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue,
  ) {}

  async register(dto: RegisterDto): Promise<{ message: string }> {
    const existingEmail = await this.userService.findByEmail(dto.email)

    if (existingEmail) {
      throw new ConflictException('Account with this email or username already exists')
    }

    const existingUsername = await this.userService.findByUsername(dto.username)

    if (existingUsername) {
      throw new ConflictException('Account with this email or username already exists')
    }

    const passwordHash = (await hash(dto.password, { type: argon2id })) as string

    const user = await this.userService.create({
      email: dto.email,
      displayName: dto.displayName,
      username: dto.username,
      passwordHash,
    })

    const token = randomBytes(32).toString('base64url')

    await Promise.all([
      this.redis.set(`email_verify:${user.id}`, token, 'EX', this.VERIFICATION_TTL),
      this.redis.set(`email_verify_token:${token}`, user.id, 'EX', this.VERIFICATION_TTL),
    ])

    try {
      await this.emailQueue.add(
        WELCOME_JOB,
        { to: user.email, token },
        {
          attempts: 5,
          backoff: { type: 'exponential', delay: 5_000 },
        },
      )
    } catch {
      throw new ServiceUnavailableException({
        message:
          'Your account was created but the verification email could not be sent. Use "Resend verification email" to receive a new link.',
        code: 'REGISTRATION_PENDING_VERIFICATION',
      })
    }

    return { message: 'Check your email to confirm your account' }
  }

  async login(req: Request, dto: LoginDto): Promise<{ user: SafeUser }> {
    const existing = await this.userService.findByEmail(dto.email)

    if (!existing || existing.method !== AuthMethod.CREDENTIALS || !existing.passwordHash) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isValidPassword = await verify(existing.passwordHash, dto.password)

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials')
    }

    if (!existing.isVerified) {
      throw new UnauthorizedException({
        message: 'Please verify your email before logging in',
        code: 'EMAIL_NOT_VERIFIED',
      })
    }

    if (existing.twoFactorEnabled) {
      if (!dto.twoFactorCode) {
        throw new UnauthorizedException({
          message: 'Two-factor authentication code is required',
          code: 'TWO_FACTOR_REQUIRED',
        })
      }

      const result = await this.twoFactorService.verifyStoredCode(existing.id, dto.twoFactorCode)

      if (!result.valid) {
        throw new UnauthorizedException({
          message: 'Invalid two-factor authentication code',
          code: 'INVALID_TWO_FACTOR_CODE',
        })
      }
    }

    await this.sessionService.create(req, existing.id)

    return { user: safeUser(existing) }
  }

  async getGoogleAuthUrl(): Promise<{ url: string }> {
    return this.googleOAuth.createAuthUrl()
  }

  async loginWithGoogle(req: Request, code: string, state: string): Promise<void> {
    const profile = await this.googleOAuth.getProfile(code, state)

    const existing = await this.userService.findByEmail(profile.email)

    if (existing && existing.method !== AuthMethod.GOOGLE) {
      throw new ConflictException('Email already registered with credentials')
    }

    const user = existing ?? (await this.userService.createGoogleUser(profile))

    await this.sessionService.create(req, user.id)

    if (!existing) {
      try {
        await this.emailQueue.add(
          WELCOME_GOOGLE_JOB,
          { to: user.email },
          {
            attempts: 5,
            backoff: { type: 'exponential', delay: 5_000 },
          },
        )
      } catch {
        this.logger.warn({ userId: user.id }, 'Failed to enqueue Google welcome email')
      }
    }
  }

  async verifyEmail(req: Request, token: string): Promise<void> {
    const userId = await this.redis.getdel(`email_verify_token:${token}`)

    if (!userId) {
      throw new UnauthorizedException('Invalid or expired verification token')
    }

    await Promise.all([
      this.redis.del(`email_verify:${userId}`),
      this.userService.verifyUser(userId),
      this.sessionService.create(req, userId),
    ])
  }

  async resendVerification(email: string): Promise<{ message: string; ttl: number }> {
    const cannedMessage =
      'If your email is registered and not yet verified, a new email has been sent'

    const user = await this.userService.findByEmail(email)

    if (!user || user.isVerified) {
      return { message: cannedMessage, ttl: this.RESEND_COOLDOWN_TTL }
    }

    const oldToken = await this.redis.get(`email_verify:${user.id}`)
    if (oldToken) {
      await Promise.all([
        this.redis.del(`email_verify:${user.id}`),
        this.redis.del(`email_verify_token:${oldToken}`),
      ])
    }

    const token = randomBytes(32).toString('base64url')

    await this.redis.set(`email_verify:${user.id}`, token, 'EX', this.VERIFICATION_TTL)
    await this.redis.set(`email_verify_token:${token}`, user.id, 'EX', this.VERIFICATION_TTL)

    try {
      await this.emailQueue.add(
        WELCOME_JOB,
        { to: user.email, token },
        {
          attempts: 5,
          backoff: { type: 'exponential', delay: 5_000 },
        },
      )
    } catch {
      return { message: cannedMessage, ttl: this.RESEND_COOLDOWN_TTL }
    }

    return { message: cannedMessage, ttl: this.RESEND_COOLDOWN_TTL }
  }

  async forgotPassword(email: string): Promise<{ message: string; ttl: number }> {
    const user = await this.userService.findByEmail(email)

    if (!user || user.method !== AuthMethod.CREDENTIALS) {
      return {
        message: 'If an account exists for this email, a password reset link has been sent.',
        ttl: this.PASSWORD_RESET_TTL,
      }
    }

    await this.invalidateResetToken(user.id)

    const token = randomBytes(32).toString('base64url')
    const tokenHash = this.hashToken(token)

    await Promise.all([
      this.redis.set(`pwreset:${user.id}`, tokenHash, 'EX', this.PASSWORD_RESET_TTL),
      this.redis.set(`pwreset_token:${tokenHash}`, user.id, 'EX', this.PASSWORD_RESET_TTL),
    ])

    try {
      await this.emailQueue.add(
        PASSWORD_RESET_JOB,
        { to: user.email, token },
        {
          attempts: 5,
          backoff: { type: 'exponential', delay: 5_000 },
        },
      )
    } catch {
      this.logger.warn({ userId: user.id }, 'Failed to enqueue password-reset email')
    }

    return {
      message: 'If an account exists for this email, a password reset link has been sent.',
      ttl: this.PASSWORD_RESET_TTL,
    }
  }

  async resetPasswordVerify(token: string): Promise<void> {
    const tokenHash = this.hashToken(token)
    const userId = await this.redis.get(`pwreset_token:${tokenHash}`)

    if (!userId) {
      throw new UnauthorizedException('Invalid or expired reset token')
    }
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const tokenHash = this.hashToken(dto.token)
    const userId = await this.redis.getdel(`pwreset_token:${tokenHash}`)

    if (!userId) {
      throw new UnauthorizedException('Invalid or expired reset token')
    }

    const user = await this.userService.findById(userId)

    if (user.method !== AuthMethod.CREDENTIALS) {
      await this.invalidateResetToken(userId)
      throw new UnauthorizedException('Invalid or expired reset token')
    }

    const passwordHash = (await hash(dto.password, { type: argon2id })) as string

    await this.userService.updatePasswordHash(userId, passwordHash)
    await this.invalidateResetToken(userId)
    await this.sessionService.destroyAllForUser(userId)

    this.logger.log({ userId }, 'Password reset completed; sessions revoked')

    return { message: 'Password has been reset' }
  }

  private async invalidateResetToken(userId: string): Promise<void> {
    const oldHash = await this.redis.get(`pwreset:${userId}`)

    if (!oldHash) {
      return
    }

    await Promise.all([
      this.redis.del(`pwreset:${userId}`),
      this.redis.del(`pwreset_token:${oldHash}`),
    ])
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex')
  }

  async me(userId: string): Promise<{ user: SafeUser }> {
    const user = await this.userService.findById(userId)

    return { user: safeUser(user) }
  }

  async logout(req: Request, res: Response): Promise<void> {
    const isProd = this.config.get('NODE_ENV', { infer: true }) === 'production'
    const cookieName = isProd ? '__Host-sid' : 'sid'

    await this.sessionService.destroy(req)

    res.clearCookie(cookieName, {
      path: '/',
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
    })
  }
}
