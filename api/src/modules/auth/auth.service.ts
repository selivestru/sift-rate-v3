import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { TwoFactorService } from '../two-factor/two-factor.service'
import { SafeUser } from '../user/types/user.types'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { GoogleOAuthService } from './google-oauth.service'
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
    private readonly googleOAuth: GoogleOAuthService,
    private readonly twoFactorService: TwoFactorService,
  ) {}

  async register(req: Request, dto: RegisterDto): Promise<{ user: SafeUser }> {
    const existingEmail = await this.userService.findByEmail(dto.email)

    if (existingEmail) {
      throw new ConflictException('Email already taken')
    }

    const existingUsername = await this.userService.findByUsername(dto.username)

    if (existingUsername) {
      throw new ConflictException('Username already taken')
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
      throw new UnauthorizedException('Invalid credentials')
    }

    const isValidPassword = await verify(existing.passwordHash, dto.password)

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials')
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

    await this.saveSession(req, existing.id)

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

    await this.saveSession(req, user.id)
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
          reject(new InternalServerErrorException('Failed to destroy session'))
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
    const { passwordHash: _, twoFactorSecret: __, ...safeUser } = user
    return safeUser
  }

  private saveSession(req: Request, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.regenerate((err) => {
        if (err) {
          reject(new InternalServerErrorException('Failed to save session'))
          return
        }

        req.session.userId = userId

        resolve()
      })
    })
  }
}
