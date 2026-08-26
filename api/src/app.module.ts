import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

import { EnvConfig, validateEnv } from './app/config/env.config'
import { AuthGuard } from './common/guards/auth.guard'
import { PrismaModule } from './infrastructure/prisma/prisma.module'
import { RedisModule } from './infrastructure/redis/redis.module'
import { S3Module } from './infrastructure/s3/s3.module'
import { AuthModule } from './modules/auth/auth.module'
import { FeedModule } from './modules/feed/feed.module'
import { ImportModule } from './modules/import/import.module'
import { MediaModule } from './modules/media/media.module'
import { PlannedModule } from './modules/planned/planned.module'
import { RankedListModule } from './modules/ranked-list/ranked-list.module'
import { ReviewModule } from './modules/review/review.module'
import { SessionModule } from './modules/session/session.module'
import { UserModule } from './modules/user/user.module'
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis'
import Redis from 'ioredis'

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
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvConfig, true>) => ({
        throttlers: [
          {
            ttl: seconds(60),
            limit: 10,
          },
        ],
        storage: new ThrottlerStorageRedisService(
          new Redis(config.get('REDIS_URL', { infer: true })),
        ),
        errorMessage: 'Too many requests, please try again later',
      }),
    }),
    S3Module,
    AuthModule,
    MediaModule,
    ImportModule,
    UserModule,
    ReviewModule,
    PlannedModule,
    RankedListModule,
    SessionModule,
    FeedModule,
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
