import { InjectQueue } from '@nestjs/bullmq'
import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common'

import { ChangePasswordDto } from './dto/change-password.dto'
import { argon2id, hash, verify } from 'argon2'
import { Queue } from 'bullmq'
import { normalize } from '~/common/utils/normalize'
import { AuthMethod, Prisma, User } from '~/generated/prisma/client'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'
import { EMAIL_QUEUE, PASSWORD_CHANGED_JOB } from '~/infrastructure/resend/constants/email-queue'
import { SessionService } from '~/modules/session/session.service'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly sessionService: SessionService,
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
}
