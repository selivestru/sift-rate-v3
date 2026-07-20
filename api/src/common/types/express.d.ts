import { AuthUser } from '~/modules/user/types/auth-user.types'

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}

export {}
