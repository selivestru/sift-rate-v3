import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'

import { normalize } from '~/common/utils/normalize'
import { AuthMethod, Prisma, User } from '~/generated/prisma/client'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

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
        displayName: data.displayName,
        username: data.username,
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

  async updateUsername(userId: string, username: string): Promise<{ username: string }> {
    const existing = await this.findByUsername(username)

    if (existing && existing.id !== userId) {
      throw new ConflictException('Username already taken')
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { username },
    })

    return { username }
  }
}
