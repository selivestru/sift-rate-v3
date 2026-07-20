import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import Redis from 'ioredis'
import { EnvConfig } from '~/app/config/env.config'

@Injectable()
export class RedisService extends Redis {
  constructor(configService: ConfigService<EnvConfig, true>) {
    super(configService.get('REDIS_URL', { infer: true }))
  }
}
