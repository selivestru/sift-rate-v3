import {
  AlertTriangle,
  Palette,
  ShieldLock,
  User as UserIcon,
  type IconComponent,
} from 'reicon-react'

import type { FileRoutesByTo } from '~/app/routeTree.gen'
import { AUTH_METHOD, type User } from '~/modules/auth'

export type SettingsNavItem = {
  to: keyof FileRoutesByTo
  label: string
  description: string
  icon: IconComponent
  tone?: 'default' | 'destructive'
  show?: (user: User | null) => boolean
}

export const accountNavItem: SettingsNavItem = {
  to: '/settings/account',
  label: 'Account',
  description: 'Email, password, username, Google',
  icon: UserIcon,
}

export const appearanceNavItem: SettingsNavItem = {
  to: '/settings/appearance',
  label: 'Appearance',
  description: 'Theme and accent color',
  icon: Palette,
}

export const twoFactorNavItem: SettingsNavItem = {
  to: '/settings/2fa',
  label: 'Two-factor auth',
  description: 'Authenticator app protection',
  icon: ShieldLock,
  show: (user) => user?.method === AUTH_METHOD.CREDENTIALS,
}

export const dangerZoneNavItem: SettingsNavItem = {
  to: '/settings/danger-zone',
  label: 'Danger zone',
  description: 'Delete your account',
  icon: AlertTriangle,
  tone: 'destructive',
}

export const settingsNavItems: SettingsNavItem[] = [
  accountNavItem,
  appearanceNavItem,
  twoFactorNavItem,
  dangerZoneNavItem,
]
