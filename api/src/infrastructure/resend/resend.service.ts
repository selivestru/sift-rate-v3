import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { RedisService } from '../redis/redis.service'
import ResetPassword from './templates/reset-password.template'
import Welcome from './templates/welcome.template'
import { pretty, render } from 'react-email'
import { Resend } from 'resend'
import { EnvConfig } from '~/app/config/env.config'

@Injectable()
export class ResendService {
  private readonly resend: Resend
  private readonly domain: string

  constructor(
    readonly config: ConfigService<EnvConfig, true>,
    private readonly redis: RedisService,
  ) {
    this.resend = new Resend(config.get('RESEND_API_KEY', { infer: true }))
    this.domain = config.get('RESEND_DOMAIN', { infer: true })
  }

  async sendWelcomeEmail(to: string, token: string) {
    const backendUrl = this.config.get('BACKEND_URL', { infer: true })
    const verificationUrl = `${backendUrl}/api/auth/verify?token=${token}`

    const html = await pretty(await render(Welcome({ verificationUrl })))

    const { error } = await this.resend.emails.send({
      from: this.domain,
      to,
      subject: 'Welcome to SiftRate',
      html,
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  async sendGoogleWelcomeEmail(to: string) {
    const html = await pretty(await render(Welcome({})))

    const { error } = await this.resend.emails.send({
      from: this.domain,
      to,
      subject: 'Welcome to SiftRate',
      html,
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const origin = this.config.get('ORIGIN', { infer: true })
    const resetUrl = `${origin}/auth/reset-password?token=${token}`

    const html = await pretty(
      await render(ResetPassword({ resetUrl, expiresInLabel: 'expires in 1 hour' })),
    )

    const { error } = await this.resend.emails.send({
      from: this.domain,
      to,
      subject: 'Reset your SiftRate password',
      html,
    })

    if (error) {
      throw new Error(error.message)
    }
  }
}
