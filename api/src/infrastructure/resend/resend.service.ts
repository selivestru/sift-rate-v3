import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import Welcome from './templates/welcome.template'
import { pretty, render } from 'react-email'
import { Resend } from 'resend'
import { EnvConfig } from '~/app/config/env.config'

@Injectable()
export class ResendService {
  private readonly resend: Resend

  constructor(readonly config: ConfigService<EnvConfig, true>) {
    this.resend = new Resend(config.get('RESEND_API_KEY', { infer: true }))
  }

  async sendWelcomeEmail(to: string, token: string) {
    const backendUrl = this.config.get('BACKEND_URL', { infer: true })
    const verificationUrl = `${backendUrl}/api/auth/verify?token=${token}`
    const html = await pretty(await render(Welcome({ verificationUrl })))

    await this.resend.emails.send({
      from: 'SiftRate <onboarding@resend.dev>',
      to,
      subject: 'Welcome to SiftRate',
      html,
    })
  }

  async sendGoogleWelcomeEmail(to: string) {
    const html = await pretty(await render(Welcome({})))

    await this.resend.emails.send({
      from: 'SiftRate <onboarding@resend.dev>',
      to,
      subject: 'Welcome to SiftRate',
      html,
    })
  }
}
