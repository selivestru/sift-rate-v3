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
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { GoogleOAuthService } from './google-oauth.service'
import { argon2id, hash, verify } from 'argon2'
import { Queue } from 'bullmq'
import type { Request, Response } from 'express'
import { randomBytes } from 'node:crypto'
import { EnvConfig } from '~/app/config/env.config'
import { AuthMethod, User } from '~/generated/prisma/client'
import { RedisService } from '~/infrastructure/redis/redis.service'
import {
  EMAIL_QUEUE,
  WELCOME_GOOGLE_JOB,
  WELCOME_JOB,
} from '~/infrastructure/resend/constants/email-queue'
import { UserService } from '~/modules/user/user.service'

@Injectable()
export class AuthService {
  private readonly VERIFICATION_TTL = 86_400
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

    return { user: this.safeUser(existing) }
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

    await this.userService.verifyUser(userId)
    await this.sessionService.create(req, userId)
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    const cannedMessage =
      'If your email is registered and not yet verified, a new email has been sent'

    const user = await this.userService.findByEmail(email)

    if (!user || user.isVerified) {
      return { message: cannedMessage }
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
      return { message: cannedMessage }
    }

    return { message: cannedMessage }
  }

  async me(userId: string): Promise<{ user: SafeUser }> {
    const user = await this.userService.findById(userId)

    return { user: this.safeUser(user) }
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

  private safeUser(user: User): SafeUser {
    const { passwordHash: _, twoFactorSecret: __, ...safeUser } = user
    return safeUser
  }
}
