import { Link } from '@tanstack/react-router'
import { useIntlayer } from 'react-intlayer'

import { cn } from '~/common/utils/cn'
import { useAuthStore } from '~/modules/auth'

import { settingsNavItems, type SettingsNavItem } from '../constants/settings-nav'

const useSettingsNavCopy = () => {
  const content = useIntlayer('settings-nav')

  return {
    '/settings/account': content.account.value,
    '/settings/imports': content.imports.value,
    '/settings/danger-zone': content.dangerZone.value,
  } as const satisfies Partial<Record<SettingsNavItem['to'], string>>
}

export const SettingsNav = () => {
  const user = useAuthStore((state) => state.user)
  const content = useIntlayer('settings-nav')
  const labels = useSettingsNavCopy()

  const visibleItems = settingsNavItems.filter((item) => !item.show || item.show(user))

  return (
    <nav aria-label={content.sections.value}>
      <ul className="flex flex-col gap-1">
        {visibleItems.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className={cn(
                'text-muted-foreground relative flex h-10 items-center gap-2.5 rounded-md px-3 text-sm font-medium transition-colors duration-200',
                'focus-visible:ring-ring/40 focus-visible:ring-2 focus-visible:outline-none',
                'hover:bg-accent hover:text-accent-foreground',
                item.tone === 'destructive' && 'hover:text-destructive',
              )}
              activeProps={{
                className: cn(
                  'bg-accent text-accent-foreground hover:bg-accent',
                  item.tone === 'destructive' && 'text-destructive hover:text-destructive',
                ),
              }}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      'size-5 shrink-0',
                      isActive && item.tone === 'destructive' && 'text-destructive',
                      isActive && item.tone !== 'destructive' && 'text-accent-foreground',
                    )}
                  />
                  <span className={cn('flex-1', isActive && 'text-accent-foreground')}>
                    {labels[item.to as keyof typeof labels] ?? item.label}
                  </span>
                </>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
