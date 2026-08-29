import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { OAuth2Client } from 'google-auth-library'
import { randomBytes } from 'node:crypto'
import { EnvConfig } from '~/app/config/env.config'
import { RedisService } from '~/infrastructure/redis/redis.service'

export interface GoogleProfile {
  email: string
  avatarUrl: string | null
}

@Injectable()
export class GoogleOAuthService {
  private readonly client: OAuth2Client
  private readonly STATE_PREFIX = 'oauth:state:'
  private readonly STATE_TTL_SECONDS = 600

  constructor(
    private readonly config: ConfigService<EnvConfig, true>,
    private readonly redis: RedisService,
  ) {
    this.client = new OAuth2Client(
      config.get('GOOGLE_CLIENT_ID', { infer: true }),
      config.get('GOOGLE_CLIENT_SECRET', { infer: true }),
      config.get('GOOGLE_REDIRECT_URI', { infer: true }),
    )
  }

  async createAuthUrl(): Promise<{ url: string }> {
    const state = randomBytes(32).toString('base64url')

    await this.redis.set(this.STATE_PREFIX + state, '1', 'EX', this.STATE_TTL_SECONDS)

    const url = this.client.generateAuthUrl({
      access_type: 'online',
      scope: ['openid', 'email', 'profile'],
      state,
    })

    return { url }
  }

  async getProfile(code: string, state: string): Promise<GoogleProfile> {
    const storedState = await this.redis.getdel(this.STATE_PREFIX + state)

    if (!storedState) {
      throw new BadRequestException('Invalid or expired OAuth state')
    }

    const { tokens } = await this.client.getToken(code)

    if (!tokens.id_token) {
      throw new BadRequestException('Missing Google ID token')
    }

    const ticket = await this.client.verifyIdToken({
      idToken: tokens.id_token,
      audience: this.config.get('GOOGLE_CLIENT_ID', { infer: true }),
    })

    const payload = ticket.getPayload()

    if (!payload?.email || !payload.email_verified) {
      throw new BadRequestException('Google email is not verified')
    }

    return {
      email: payload.email,
      avatarUrl: payload.picture ?? null,
    }
  }
}
