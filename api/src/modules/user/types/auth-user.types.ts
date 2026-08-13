import { Subscription } from '~/generated/prisma/enums'

export type AuthUser = {
  sessionId: string
  userId: string
  email: string
  username: string | null
  subscription: Subscription
}
