import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { RedisService } from '../redis/redis.service'
import AccountDeleted from './templates/account-deleted.template'
import DeleteAccount from './templates/delete-account.template'
import EmailChangeConfirm from './templates/email-change-confirm.template'
import EmailChangeNotify from './templates/email-change-notify.template'
import PasswordChanged from './templates/password-changed.template'
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

  async sendPasswordChangedEmail(to: string) {
    const html = await pretty(await render(PasswordChanged()))

    const { error } = await this.resend.emails.send({
      from: this.domain,
      to,
      subject: 'Your SiftRate password was changed',
      html,
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  async sendEmailChangeConfirmation(to: string, token: string) {
    const backendUrl = this.config.get('BACKEND_URL', { infer: true })
    const confirmUrl = `${backendUrl}/api/auth/confirm-email-change?token=${token}`

    const html = await pretty(
      await render(EmailChangeConfirm({ confirmUrl, expiresInLabel: 'expires in 24 hours' })),
    )

    const { error } = await this.resend.emails.send({
      from: this.domain,
      to,
      subject: 'Confirm your new SiftRate email address',
      html,
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  async sendEmailChangeRequested(to: string, newEmail: string) {
    const html = await pretty(await render(EmailChangeNotify({ newEmail })))

    const { error } = await this.resend.emails.send({
      from: this.domain,
      to,
      subject: 'We received a request to change your SiftRate email',
      html,
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  async sendDeleteAccountConfirmation(to: string, token: string) {
    const backendUrl = this.config.get('BACKEND_URL', { infer: true })
    const confirmUrl = `${backendUrl}/api/user/delete-confirm?token=${token}`

    const html = await pretty(
      await render(DeleteAccount({ confirmUrl, expiresInLabel: 'expires in 15 minutes' })),
    )

    const { error } = await this.resend.emails.send({
      from: this.domain,
      to,
      subject: 'Confirm deletion of your SiftRate account',
      html,
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  async sendAccountDeletedEmail(to: string) {
    const html = await pretty(await render(AccountDeleted()))

    const { error } = await this.resend.emails.send({
      from: this.domain,
      to,
      subject: 'Your SiftRate account has been deleted',
      html,
    })

    if (error) {
      throw new Error(error.message)
    }
  }
}
