import { AlertTriangle, ShieldLock, User, type IconComponent } from 'reicon-react'

export type SettingsNavItem = {
  to: '/settings/account' | '/settings/2fa' | '/settings/danger-zone'
  label: string
  description: string
  icon: IconComponent
  tone?: 'default' | 'destructive'
}

export const accountNavItem: SettingsNavItem = {
  to: '/settings/account',
  label: 'Account',
  description: 'Email, password, username, Google',
  icon: User,
}

export const twoFactorNavItem: SettingsNavItem = {
  to: '/settings/2fa',
  label: 'Two-factor auth',
  description: 'Authenticator app protection',
  icon: ShieldLock,
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
  twoFactorNavItem,
  dangerZoneNavItem,
]
