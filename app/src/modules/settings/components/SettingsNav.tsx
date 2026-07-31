import { Link } from '@tanstack/react-router'

import { cn } from '~/common/utils/cn'
import { useAuthStore } from '~/modules/auth'

import { settingsNavItems } from '../constants/settings-nav'

export const SettingsNav = () => {
  const user = useAuthStore((state) => state.user)

  const visibleItems = settingsNavItems.filter((item) => !item.show || item.show(user))

  return (
    <nav aria-label="Settings sections">
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
                    {item.label}
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
