import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common'

import { Response } from 'express'
import { Prisma } from '~/generated/prisma/client'

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaClientExceptionFilter.name)

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost): void {
    if (host.getType() !== 'http') {
      throw exception
    }

    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'Internal server error'

    switch (exception.code) {
      case 'P2002': {
        status = HttpStatus.CONFLICT
        message = 'Resource already exists'
        break
      }
      case 'P2025': {
        status = HttpStatus.NOT_FOUND
        message = 'Resource not found'
        break
      }
      default: {
        this.logger.error({ code: exception.code }, `Unhandled Prisma error: ${exception.message}`)
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
    })
  }
}
