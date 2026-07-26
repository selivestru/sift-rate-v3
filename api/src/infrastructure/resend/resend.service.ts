import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { Resend } from 'resend'
import { EnvConfig } from '~/app/config/env.config'

@Injectable()
export class ResendService {
  private readonly resend: Resend

  constructor(readonly config: ConfigService<EnvConfig, true>) {
    this.resend = new Resend(config.get('RESEND_API_KEY', { infer: true }))
  }
}
