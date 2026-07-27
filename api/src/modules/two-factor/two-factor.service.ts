import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common'

import { generateSecret, generateURI as generateTOTPURI, verifySync } from 'otplib'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'
import { RedisService } from '~/infrastructure/redis/redis.service'

@Injectable()
export class TwoFactorService {
  private readonly logger = new Logger(TwoFactorService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async setup(userId: string, email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        twoFactorEnabled: true,
      },
    })

    if (user?.twoFactorEnabled) {
      throw new ConflictException('Two-factor authentication is already enabled')
    }

    const savedSecret = await this.redis.get(`2fa:${userId}`)

    if (savedSecret) {
      return {
        otpauthUrl: this.generateURI(savedSecret, email),
        secret: savedSecret,
      }
    }

    const secret = generateSecret()

    const otpauthUrl = this.generateURI(secret, email)

    await this.redis.set(`2fa:${userId}`, secret, 'EX', 60 * 15)

    return {
      otpauthUrl,
      secret,
    }
  }

  async verify(userId: string, code: string) {
    const savedSecret = await this.redis.get(`2fa:${userId}`)

    if (!savedSecret) {
      throw new UnauthorizedException('Secret not found')
    }

    const result = this.verifySecret(savedSecret, code)

    if (!result.valid) {
      throw new UnauthorizedException('Invalid code or secret')
    }

    const [user] = await Promise.all([
      this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          twoFactorEnabled: true,
          twoFactorSecret: savedSecret,
        },
        select: {
          twoFactorEnabled: true,
        },
      }),
      this.redis.del(`2fa:${userId}`),
    ])

    this.logger.log(`2FA enabled for user ${userId}`)

    return user
  }

  async disable(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        twoFactorEnabled: true,
        twoFactorSecret: true,
      },
    })

    if (!user?.twoFactorSecret) {
      throw new UnauthorizedException('Secret not found')
    }

    const result = this.verifySecret(user.twoFactorSecret, code)

    if (!result.valid) {
      throw new UnauthorizedException('Invalid code or secret')
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
      select: {
        twoFactorEnabled: true,
      },
    })

    this.logger.log(`2FA disabled for user ${userId}`)

    return updatedUser
  }

  async verifyStoredCode(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        twoFactorEnabled: true,
        twoFactorSecret: true,
      },
    })

    if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
      return { valid: false }
    }

    return this.verifySecret(user.twoFactorSecret, code)
  }

  private generateURI(secret: string, email: string) {
    return generateTOTPURI({
      issuer: 'SiftRate',
      label: email,
      secret,
    })
  }

  private verifySecret(secret: string, code: string) {
    return verifySync({
      secret,
      token: code,
      counterTolerance: 1,
    })
  }
}
