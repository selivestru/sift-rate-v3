import { SUBSCRIPTIONS } from '~/modules/auth'

export interface SubscriptionMeta {
  label: string
  color?: string
}

export const SUBSCRIPTION_FREE = {
  label: 'Free',
  color: undefined,
}

export const SUBSCRIPTION_MONTHLY = {
  label: 'Monthly',
  color: '#60A5FA',
}

export const SUBSCRIPTION_YEARLY = {
  label: 'Yearly',
  color: '#A78BFA',
}

export const SUBSCRIPTION_LIFETIME = {
  label: 'Lifetime',
  color: '#FBBF24',
}

export const subscriptionMeta = {
  [SUBSCRIPTIONS.FREE]: SUBSCRIPTION_FREE,
  [SUBSCRIPTIONS.MONTHLY]: SUBSCRIPTION_MONTHLY,
  [SUBSCRIPTIONS.YEARLY]: SUBSCRIPTION_YEARLY,
  [SUBSCRIPTIONS.LIFETIME]: SUBSCRIPTION_LIFETIME,
} as const
