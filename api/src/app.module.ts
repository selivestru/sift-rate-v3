import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

import { EnvConfig, validateEnv } from './app/config/env.config'
import { AuthGuard } from './common/guards/auth.guard'
import { PrismaModule } from './infrastructure/prisma/prisma.module'
import { RedisModule } from './infrastructure/redis/redis.module'
import { ResendModule } from './infrastructure/resend/resend.module'
import { S3Module } from './infrastructure/s3/s3.module'
import { AuthModule } from './modules/auth/auth.module'
import { MediaModule } from './modules/media/media.module'
import { PlannedModule } from './modules/planned/planned.module'
import { RankedListModule } from './modules/ranked-list/ranked-list.module'
import { ReviewModule } from './modules/review/review.module'
import { SessionModule } from './modules/session/session.module'
import { TwoFactorModule } from './modules/two-factor/two-factor.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvConfig, true>) => ({
        connection: {
          url: config.get('REDIS_URL', { infer: true }),
          maxRetriesPerRequest: null,
        },
      }),
    }),
    PrismaModule,
    RedisModule,
    ThrottlerModule.forRoot([
      {
        ttl: seconds(60),
        limit: 10,
      },
    ]),
    S3Module,
    AuthModule,
    MediaModule,
    UserModule,
    ReviewModule,
    PlannedModule,
    RankedListModule,
    ResendModule,
    TwoFactorModule,
    SessionModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
