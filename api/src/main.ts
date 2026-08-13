import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'

import { AppModule } from './app.module'
import { EnvConfig } from './app/config/env.config'
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { SessionMiddlewareService } from '~/modules/session/session.middleware'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.set('trust proxy', 1)

  const config = app.get(ConfigService<EnvConfig, true>)
  const sessionMiddleware = app.get(SessionMiddlewareService)

  app.useGlobalFilters(new PrismaClientExceptionFilter())

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  )

  app.use(cookieParser())

  app.use(sessionMiddleware.getMiddleware())

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
