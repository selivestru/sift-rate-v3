import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { EnvConfig } from './app/config/env.config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get(ConfigService<EnvConfig>)

  app.enableCors({
    origin: configService.getOrThrow<string>('ORIGIN'),
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  app.setGlobalPrefix('api')

  const port = configService.getOrThrow<string>('PORT')

  await app.listen(port)
}

void bootstrap()
