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
import { CompleteProfileDto } from './dto/complete-profile.dto'
import { ResetPasswordDto } from './dto/forgot-password.dto'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { GoogleOAuthService } from './google-oauth.service'
import { argon2id, hash, verify } from 'argon2'
import { Queue } from 'bullmq'
import type { Request, Response } from 'express'
import { createHash, randomBytes } from 'node:crypto'
import { EnvConfig } from '~/app/config/env.config'
import { REDIS_KEYS } from '~/common/constants/redis-keys'
import { normalize } from '~/common/utils/normalize'
import { safeUser } from '~/common/utils/safeUser'
import { AuthMethod } from '~/generated/prisma/client'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'
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
  private readonly RESEND_COOLDOWN_SECONDS = 60
  private readonly VERIFY_CANNED_MESSAGE =
    'If your email is registered and not yet verified, a new email has been sent'
  private readonly FORGOT_PASSWORD_CANNED_MESSAGE =
    'If an account exists for this email, a password reset link has been sent.'
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService<EnvConfig, true>,
    private readonly googleOAuth: GoogleOAuthService,
    private readonly twoFactorService: TwoFactorService,
    private readonly redis: RedisService,
    private readonly sessionService: SessionService,
    @InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue,
  ) {}

  async register(dto: RegisterDto): Promise<{ message: string }> {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: normalize(dto.email) }, { username: normalize(dto.username) }],
      },
    })

    if (existing) {
      throw new ConflictException('Account with this email or username already exists')
    }

    const passwordHash = (await hash(dto.password, { type: argon2id })) as string

    const user = await this.userService.create({
      email: dto.email,
      displayName: dto.displayName,
      username: dto.username,
      passwordHash,
    })

    try {
      await this.issueVerificationToken(user.id, user.email)
    } catch (err) {
      this.logger.error(`Failed to queue verification email for user ${user.id}`, err)
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

    const isCredentialsUser =
      !!existing && existing.method === AuthMethod.CREDENTIALS && !!existing.passwordHash

    const isValidPassword = await verify(
      isCredentialsUser ? existing.passwordHash! : this.config.get('DUMMY_HASH', { infer: true }),
      dto.password,
    )

    if (!isCredentialsUser || !isValidPassword) {
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

  async completeProfile(
    userId: string,
    dto: CompleteProfileDto,
  ): Promise<Pick<SafeUser, 'displayName' | 'username'>> {
    const [{ displayName }, { username }] = await Promise.all([
      this.userService.updateDisplayName(userId, dto.displayName),
      this.userService.updateUsername(userId, dto.username),
    ])

    return {
      displayName,
      username,
    }
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

  async verifyEmail(token: string): Promise<void> {
    const userId = await this.redis.getdel(REDIS_KEYS.EMAIL_VERIFY_TOKEN(token))

    if (!userId) {
      throw new UnauthorizedException('Invalid or expired verification token')
    }

    await this.redis.del(REDIS_KEYS.EMAIL_VERIFY(userId))

    await this.userService.verifyUser(userId)
  }

  async confirmEmailChange(token: string): Promise<void> {
    const tokenHash = this.hashToken(token)
    const data = await this.redis.getdel(REDIS_KEYS.EMAIL_CHANGE_TOKEN(tokenHash))

    if (!data) {
      throw new UnauthorizedException('Invalid or expired email change token')
    }

    const separatorIndex = data.indexOf(':')
    const userId = data.slice(0, separatorIndex)
    const newEmail = data.slice(separatorIndex + 1)

    const user = await this.userService.findById(userId)

    if (user.method !== AuthMethod.CREDENTIALS) {
      await this.invalidateEmailChange(userId)
      throw new UnauthorizedException('Invalid or expired email change token')
    }

    const existing = await this.userService.findByEmail(newEmail)

    if (existing && existing.id !== userId) {
      await this.invalidateEmailChange(userId)
      throw new ConflictException('This email is already in use')
    }

    await this.userService.updateEmail(userId, newEmail)
    await this.invalidateEmailChange(userId)
    await this.sessionService.destroyAllForUser(userId)

    this.logger.log({ userId }, 'Email change confirmed; sessions revoked')
  }

  async resendVerification(email: string): Promise<{ message: string; retryAfter: number }> {
    const user = await this.userService.findByEmail(email)

    if (!user || user.isVerified) {
      return { message: this.VERIFY_CANNED_MESSAGE, retryAfter: this.RESEND_COOLDOWN_SECONDS }
    }

    const oldToken = await this.redis.get(REDIS_KEYS.EMAIL_VERIFY(user.id))

    if (oldToken) {
      const ttl = await this.redis.ttl(REDIS_KEYS.EMAIL_VERIFY(user.id))
      const elapsed = this.VERIFICATION_TTL - ttl

      if (elapsed < this.RESEND_COOLDOWN_SECONDS) {
        const retryAfter = this.RESEND_COOLDOWN_SECONDS - elapsed
        return { message: this.VERIFY_CANNED_MESSAGE, retryAfter }
      }

      await Promise.all([
        this.redis.del(REDIS_KEYS.EMAIL_VERIFY(user.id)),
        this.redis.del(REDIS_KEYS.EMAIL_VERIFY_TOKEN(oldToken)),
      ])
    }

    try {
      await this.issueVerificationToken(user.id, user.email)
    } catch (err) {
      this.logger.error(`Failed to queue resend email for user ${user.id}`, err)
    }

    return { message: this.VERIFY_CANNED_MESSAGE, retryAfter: this.RESEND_COOLDOWN_SECONDS }
  }

  async forgotPassword(email: string): Promise<{ message: string; retryAfter: number }> {
    const user = await this.userService.findByEmail(email)

    if (!user || user.method !== AuthMethod.CREDENTIALS) {
      return {
        message: this.FORGOT_PASSWORD_CANNED_MESSAGE,
        retryAfter: this.PASSWORD_RESET_TTL,
      }
    }

    await this.invalidateResetToken(user.id)

    const token = randomBytes(32).toString('base64url')
    const tokenHash = this.hashToken(token)

    await Promise.all([
      this.redis.set(REDIS_KEYS.PASSWORD_RESET(user.id), tokenHash, 'EX', this.PASSWORD_RESET_TTL),
      this.redis.set(
        REDIS_KEYS.PASSWORD_RESET_TOKEN(tokenHash),
        user.id,
        'EX',
        this.PASSWORD_RESET_TTL,
      ),
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
      message: this.FORGOT_PASSWORD_CANNED_MESSAGE,
      retryAfter: this.PASSWORD_RESET_TTL,
    }
  }

  async resetPasswordVerify(token: string): Promise<void> {
    const tokenHash = this.hashToken(token)
    const userId = await this.redis.get(REDIS_KEYS.PASSWORD_RESET_TOKEN(tokenHash))

    if (!userId) {
      throw new UnauthorizedException('Invalid or expired reset token')
    }
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const tokenHash = this.hashToken(dto.token)
    const userId = await this.redis.getdel(REDIS_KEYS.PASSWORD_RESET_TOKEN(tokenHash))

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

  private async issueVerificationToken(userId: string, email: string): Promise<void> {
    const token = randomBytes(32).toString('base64url')

    await this.redis.set(REDIS_KEYS.EMAIL_VERIFY(userId), token, 'EX', this.VERIFICATION_TTL)
    await this.redis.set(REDIS_KEYS.EMAIL_VERIFY_TOKEN(token), userId, 'EX', this.VERIFICATION_TTL)

    await this.emailQueue.add(
      WELCOME_JOB,
      { to: email, token },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 5_000 },
      },
    )
  }

  private async invalidateResetToken(userId: string): Promise<void> {
    const oldHash = await this.redis.get(REDIS_KEYS.PASSWORD_RESET(userId))

    if (!oldHash) {
      return
    }

    await Promise.all([
      this.redis.del(REDIS_KEYS.PASSWORD_RESET(userId)),
      this.redis.del(REDIS_KEYS.PASSWORD_RESET_TOKEN(oldHash)),
    ])
  }

  private async invalidateEmailChange(userId: string): Promise<void> {
    const oldHash = await this.redis.get(REDIS_KEYS.EMAIL_CHANGE(userId))

    if (!oldHash) {
      return
    }

    await Promise.all([
      this.redis.del(REDIS_KEYS.EMAIL_CHANGE(userId)),
      this.redis.del(REDIS_KEYS.EMAIL_CHANGE_TOKEN(oldHash)),
    ])
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex')
  }
}
