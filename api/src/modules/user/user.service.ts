import { InjectQueue } from '@nestjs/bullmq'
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'

import { ChangeEmailDto } from './dto/change-email.dto'
import { ChangePasswordDto } from './dto/change-password.dto'
import { argon2id, hash, verify } from 'argon2'
import { Queue } from 'bullmq'
import { createHash, randomBytes } from 'node:crypto'
import { normalize } from '~/common/utils/normalize'
import { AuthMethod, Prisma, User } from '~/generated/prisma/client'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'
import { RedisService } from '~/infrastructure/redis/redis.service'
import {
  EMAIL_CHANGE_CONFIRM_JOB,
  EMAIL_CHANGE_NOTIFY_JOB,
  EMAIL_QUEUE,
  PASSWORD_CHANGED_JOB,
} from '~/infrastructure/resend/constants/email-queue'
import { SessionService } from '~/modules/session/session.service'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)
  private readonly EMAIL_CHANGE_TTL = 86_400

  constructor(
    private readonly prisma: PrismaService,
    private readonly sessionService: SessionService,
    private readonly redis: RedisService,
    @InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email: normalize(email) },
    })
  }

  findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username: normalize(username) },
    })
  }

  create(data: {
    email: string
    displayName: string
    username: string
    passwordHash: string
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: normalize(data.email),
        username: normalize(data.username),
        displayName: data.displayName,
        passwordHash: data.passwordHash,
        method: AuthMethod.CREDENTIALS,
      },
    })
  }

  createGoogleUser(data: {
    email: string
    displayName: string | null
    avatarUrl: string | null
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: normalize(data.email),
        displayName: data.displayName,
        avatarUrl: data.avatarUrl,
        method: AuthMethod.GOOGLE,
        isVerified: true,
      },
    })
  }

  verifyUser(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    })
  }

  updateTwoFactor(
    userId: string,
    data: Pick<Prisma.UserUpdateInput, 'twoFactorEnabled' | 'twoFactorSecret'>,
  ): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data,
    })
  }

  updatePasswordHash(userId: string, passwordHash: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    })
  }

  updateEmail(userId: string, email: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { email: normalize(email) },
    })
  }

  async updateDisplayName(userId: string, displayName: string): Promise<{ displayName: string }> {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { displayName },
      select: { displayName: true },
    })

    return { displayName: updatedUser.displayName! }
  }

  async updateUsername(userId: string, username: string): Promise<{ username: string }> {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { username: normalize(username) },
      select: { username: true },
    })

    return { username: updatedUser.username! }
  }

  async changePassword(
    userId: string,
    currentSid: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.findById(userId)

    if (user.method !== AuthMethod.CREDENTIALS || !user.passwordHash) {
      throw new UnauthorizedException('Password change is not available for this account')
    }

    const isValidPassword = await verify(user.passwordHash, dto.currentPassword)

    if (!isValidPassword) {
      throw new UnauthorizedException('Current password is incorrect')
    }

    const passwordHash = (await hash(dto.newPassword, { type: argon2id })) as string

    await this.updatePasswordHash(userId, passwordHash)
    await this.sessionService.destroyAllForUser(userId, currentSid)

    try {
      await this.emailQueue.add(
        PASSWORD_CHANGED_JOB,
        { to: user.email },
        {
          attempts: 5,
          backoff: { type: 'exponential', delay: 5_000 },
        },
      )
    } catch {
      this.logger.warn({ userId }, 'Failed to enqueue password-changed email')
    }

    return { message: 'Password has been changed' }
  }

  async changeEmail(userId: string, dto: ChangeEmailDto): Promise<{ message: string }> {
    const user = await this.findById(userId)

    if (user.method !== AuthMethod.CREDENTIALS || !user.passwordHash) {
      throw new UnauthorizedException('Email change is not available for this account')
    }

    const isValidPassword = await verify(user.passwordHash, dto.currentPassword)

    if (!isValidPassword) {
      throw new UnauthorizedException('Current password is incorrect')
    }

    if (dto.newEmail === user.email) {
      throw new ConflictException('New email must be different from your current email')
    }

    const existing = await this.findByEmail(dto.newEmail)

    if (existing) {
      throw new ConflictException('This email is already in use')
    }

    await this.invalidatePendingEmailChange(userId)

    const token = randomBytes(32).toString('base64url')
    console.debug('token', token)
    const tokenHash = this.hashToken(token)

    await Promise.all([
      this.redis.set(`email_change:${userId}`, tokenHash, 'EX', this.EMAIL_CHANGE_TTL),
      this.redis.set(
        `email_change_token:${tokenHash}`,
        `${userId}:${dto.newEmail}`,
        'EX',
        this.EMAIL_CHANGE_TTL,
      ),
    ])

    try {
      await Promise.all([
        this.emailQueue.add(
          EMAIL_CHANGE_CONFIRM_JOB,
          { to: dto.newEmail, token },
          {
            attempts: 5,
            backoff: { type: 'exponential', delay: 5_000 },
          },
        ),
        this.emailQueue.add(
          EMAIL_CHANGE_NOTIFY_JOB,
          { to: user.email, newEmail: dto.newEmail },
          {
            attempts: 5,
            backoff: { type: 'exponential', delay: 5_000 },
          },
        ),
      ])
    } catch {
      this.logger.warn({ userId }, 'Failed to enqueue email-change emails')
    }

    return { message: 'Check your new email to confirm the change' }
  }

  private async invalidatePendingEmailChange(userId: string): Promise<void> {
    const oldHash = await this.redis.get(`email_change:${userId}`)

    if (!oldHash) {
      return
    }

    await Promise.all([
      this.redis.del(`email_change:${userId}`),
      this.redis.del(`email_change_token:${oldHash}`),
    ])
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex')
  }
}
