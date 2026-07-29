import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'

import { AuthMethod, User } from '~/generated/prisma/client'
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

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    })
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    })
  }

  async create(data: {
    email: string
    displayName: string
    username: string
    passwordHash: string
  }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        displayName: data.displayName,
        username: data.username,
        passwordHash: data.passwordHash,
        method: AuthMethod.CREDENTIALS,
      },
    })
  }

  async createGoogleUser(data: { email: string; displayName: string; avatarUrl: string | null }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        displayName: data.displayName,
        avatarUrl: data.avatarUrl,
        method: AuthMethod.GOOGLE,
        isVerified: true,
      },
    })
  }

  async verifyUser(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
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
