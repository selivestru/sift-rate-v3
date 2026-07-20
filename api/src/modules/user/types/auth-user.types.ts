import { Subscription } from '~/generated/prisma/enums'

export type AuthUser = {
  userId: string
  username: string | null
  subscription: Subscription
}
