import { HttpException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { SafeUser } from '../user/types/user.types'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { argon2id, hash, verify } from 'argon2'
import type { Request, Response } from 'express'
import { EnvConfig } from '~/app/config/env.config'
import { AuthMethod, User } from '~/generated/prisma/client'
import { UserService } from '~/modules/user/user.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly config: ConfigService<EnvConfig, true>,
  ) {}

  async register(req: Request, dto: RegisterDto): Promise<{ user: SafeUser }> {
    const existingEmail = await this.userService.findByEmail(dto.email)

    if (existingEmail) {
      throw new HttpException('Email already taken', 409)
    }

    const existingUsername = await this.userService.findByUsername(dto.username)

    if (existingUsername) {
      throw new HttpException('Username already taken', 409)
    }

    const passwordHash = (await hash(dto.password, { type: argon2id })) as string

    const user = await this.userService.create({
      email: dto.email,
      displayName: dto.displayName,
      username: dto.username,
      passwordHash,
    })

    await this.saveSession(req, user.id)

    return { user: this.safeUser(user) }
  }

  async login(req: Request, dto: LoginDto): Promise<{ user: SafeUser }> {
    const existing = await this.userService.findByEmail(dto.email)

    if (!existing || existing.method !== AuthMethod.CREDENTIALS || !existing.passwordHash) {
      throw new HttpException('Invalid credentials', 401)
    }

    const isValidPassword = await verify(existing.passwordHash, dto.password)

    if (!isValidPassword) {
      throw new HttpException('Invalid credentials', 401)
    }

    await this.saveSession(req, existing.id)

    return { user: this.safeUser(existing) }
  }

  async me(userId: string): Promise<{ user: SafeUser }> {
    const user = await this.userService.findById(userId)

    return { user: this.safeUser(user) }
  }

  async logout(req: Request, res: Response): Promise<void> {
    const isProd = this.config.get('NODE_ENV', { infer: true }) === 'production'
    const cookieName = isProd ? '__Host-sid' : 'sid'

    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(new HttpException('Failed to destroy session', 500))
          return
        }

        resolve()
      })
    })

    res.clearCookie(cookieName, {
      path: '/',
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
    })
  }

  private safeUser(user: User): SafeUser {
    const { passwordHash: _, ...safeUser } = user
    return safeUser
  }

  private persistSession(req: Request): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          reject(new HttpException('Failed to save session', 500))
          return
        }

        resolve()
      })
    })
  }

  private saveSession(req: Request, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.regenerate((err) => {
        if (err) {
          reject(new HttpException('Failed to save session', 500))
          return
        }

        req.session.userId = userId

        resolve()
      })
    })
  }
}
