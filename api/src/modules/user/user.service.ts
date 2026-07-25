import { Injectable, NotFoundException } from '@nestjs/common'

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
}
