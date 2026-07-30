import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'

import { AppModule } from './app.module'
import { EnvConfig } from './app/config/env.config'
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter'
import { RedisService } from './infrastructure/redis/redis.service'
import RedisStore from 'connect-redis'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.set('trust proxy', 1)

  const config = app.get(ConfigService<EnvConfig, true>)
  const redis = app.get(RedisService)

  app.useGlobalFilters(new PrismaClientExceptionFilter())

  const isProd = config.get('NODE_ENV', { infer: true }) === 'production'

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  )

  app.use(cookieParser())

  app.use(
    session({
      store: new RedisStore({
        client: redis,
        prefix: config.get('SESSION_PREFIX', { infer: true }),
      }),
      name: isProd ? '__Host-sid' : 'sid',
      secret: config.get('SESSION_SECRET', { infer: true }),
      resave: false,
      rolling: true,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    }),
  )

  app.enableCors({
    origin: config.get('ORIGIN', { infer: true }),
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  app.setGlobalPrefix('api')

  const port = config.get('PORT', { infer: true })
  await app.listen(port)
}

void bootstrap()
