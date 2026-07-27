export const SUBSCRIPTIONS = {
  FREE: 'FREE',
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
  LIFETIME: 'LIFETIME',
} as const

export type Subscription = (typeof SUBSCRIPTIONS)[keyof typeof SUBSCRIPTIONS]

export interface User {
  id: string
  email: string
  username: string | null
  displayName: string
  avatarUrl: string | null
  method: 'CREDENTIALS' | 'GOOGLE'
  subscription: Subscription
}
