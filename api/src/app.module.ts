import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { PrismaModule } from './infrastructure/prisma/prisma.module'
import { RedisModule } from './infrastructure/redis/redis.module'
import { AuthModule } from './modules/auth/auth.module'
import { MediaModule } from './modules/media/media.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    RedisModule,
    MediaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
