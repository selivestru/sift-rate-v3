import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common'

import { UserService } from '../user/user.service'
import { generateSecret, generateURI as generateTOTPURI, verifySync } from 'otplib'
import { AuthMethod } from '~/generated/prisma/client'
import { RedisService } from '~/infrastructure/redis/redis.service'

@Injectable()
export class TwoFactorService {
  private readonly logger = new Logger(TwoFactorService.name)

  constructor(
    private readonly userService: UserService,
    private readonly redis: RedisService,
  ) {}

  async setup(userId: string, email: string) {
    const user = await this.userService.findById(userId)

    if (user.method === AuthMethod.GOOGLE) {
      throw new ConflictException(
        'Two-factor authentication is only available for credentials accounts',
      )
    }

    if (user.twoFactorEnabled) {
      throw new ConflictException('Two-factor authentication is already enabled')
    }

    const savedSecret = await this.redis.get(`2fa:${user.id}`)

    if (savedSecret) {
      return {
        otpauthUrl: this.generateURI(savedSecret, email),
        secret: savedSecret,
      }
    }

    const secret = generateSecret()

    const otpauthUrl = this.generateURI(secret, email)

    await this.redis.set(`2fa:${user.id}`, secret, 'EX', 60 * 15)

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

    const [updatedUser] = await Promise.all([
      this.userService.updateTwoFactor(userId, {
        twoFactorEnabled: true,
        twoFactorSecret: savedSecret,
      }),
      this.redis.del(`2fa:${userId}`),
    ])

    this.logger.log(`2FA enabled for user ${userId}`)

    return updatedUser
  }

  async disable(userId: string, code: string) {
    const user = await this.userService.findById(userId)

    if (!user.twoFactorSecret) {
      throw new UnauthorizedException('Secret not found')
    }

    const result = this.verifySecret(user.twoFactorSecret, code)

    if (!result.valid) {
      throw new UnauthorizedException('Invalid code or secret')
    }

    const updatedUser = await this.userService.updateTwoFactor(userId, {
      twoFactorEnabled: false,
      twoFactorSecret: null,
    })

    this.logger.log(`2FA disabled for user ${userId}`)

    return updatedUser
  }

  async verifyStoredCode(userId: string, code: string) {
    const user = await this.userService.findById(userId)

    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
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
