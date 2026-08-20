import { omit } from './omit'
import { User } from '~/generated/prisma/client'
import { SafeUser } from '~/modules/user/types/user.types'

export const safeUser = (user: User): SafeUser => {
  return omit(user, ['passwordHash', 'twoFactorSecret', 'updatedAt'])
}
