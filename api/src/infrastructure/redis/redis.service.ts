import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import Redis from 'ioredis'
import { EnvConfig } from '~/app/config/env.config'

@Injectable()
export class RedisService extends Redis {
  constructor(config: ConfigService<EnvConfig, true>) {
    super(config.get('REDIS_URL', { infer: true }))
  }
}
