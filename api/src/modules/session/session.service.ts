import { Injectable, InternalServerErrorException } from '@nestjs/common'

import { Request } from 'express'

@Injectable()
export class SessionService {
  create(req: Request, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.regenerate((err) => {
        if (err) {
          reject(new InternalServerErrorException('Failed to save session'))
          return
        }

        req.session.userId = userId

        resolve()
      })
    })
  }

  destroy(req: Request): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(new InternalServerErrorException('Failed to destroy session'))
          return
        }

        resolve()
      })
    })
  }
}
