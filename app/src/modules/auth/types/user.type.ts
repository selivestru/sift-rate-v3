export const SUBSCRIPTIONS = {
  FREE: 'FREE',
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
  LIFETIME: 'LIFETIME',
} as const

export type Subscription = (typeof SUBSCRIPTIONS)[keyof typeof SUBSCRIPTIONS]

export const AUTH_METHODS = {
  CREDENTIALS: 'CREDENTIALS',
  GOOGLE: 'GOOGLE',
}

export type AuthMethod = (typeof AUTH_METHODS)[keyof typeof AUTH_METHODS]

export interface User {
  id: string
  email: string
  username: string | null
  displayName: string
  avatarUrl: string | null
  method: AuthMethod
  twoFactorEnabled: boolean
  subscription: Subscription
}
