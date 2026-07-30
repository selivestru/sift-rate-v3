import { User } from '~/generated/prisma/client'
import { SafeUser } from '~/modules/user/types/user.types'

export const safeUser = (user: User): SafeUser => {
  const { passwordHash: _, twoFactorSecret: __, ...safeUser } = user
  return safeUser
}
