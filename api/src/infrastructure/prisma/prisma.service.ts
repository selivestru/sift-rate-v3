import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { PrismaPg } from '@prisma/adapter-pg'
import { EnvConfig } from '~/app/config/env.config'
import { PrismaClient } from '~/generated/prisma/client'

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(readonly configService: ConfigService<EnvConfig, true>) {
    const adapter = new PrismaPg({
      connectionString: configService.get('DATABASE_URL', {
        infer: true,
      }),
    })
    super({ adapter })
  }
}
