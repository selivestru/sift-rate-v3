import { Link } from '@tanstack/react-router'
import { LockIcon } from 'lucide-react'

import { navItems, type NavItemConfig } from '~/common/constants/navigation'
import { cn } from '~/common/utils/cn'
import { useAuthStore, type Subscription } from '~/modules/auth'

interface NavItemProps {
  item: NavItemConfig
  isAuthenticated: boolean
  currentSubscription: Subscription
  nested?: boolean
}

function NavItem({ item, isAuthenticated, currentSubscription, nested }: NavItemProps) {
  const isLocked =
    (item.authRequired && !isAuthenticated) ||
    (item.subscriptionRequired ? currentSubscription === 'FREE' : false)

  return (
    <>
      <Link
        to={item.to}
        params={item.params}
        disabled={isLocked}
        activeOptions={{ exact: true, includeSearch: false }}
        className={cn(
          'text-muted-foreground relative flex items-center gap-2.5 rounded-xl px-3 text-sm font-medium transition-colors duration-300',
          'focus-visible:ring-ring/40 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          nested ? 'h-9' : 'h-10',
          isLocked
            ? 'cursor-not-allowed opacity-50'
            : 'hover:bg-primary-soft hover:text-foreground',
        )}
        activeProps={{
          className: 'bg-primary/50 text-foreground hover:bg-primary/50',
        }}
      >
        {({ isActive }) => (
          <>
            <item.icon
              className={cn('size-5 shrink-0', nested && 'size-4', isActive && 'text-foreground')}
            />
            <span className={cn('flex-1', isActive && 'text-foreground')}>{item.label}</span>
            {isLocked && <LockIcon className="size-4 shrink-0 opacity-70" />}
          </>
        )}
      </Link>

      {item.children && (
        <ul className="border-border/60 mt-1 ml-5 flex flex-col gap-0.5 border-l pl-2">
          {item.children.map((child) => (
            <NavItem
              nested
              key={child.params?.mediaType ?? child.to}
              item={child}
              isAuthenticated={isAuthenticated}
              currentSubscription={currentSubscription}
            />
          ))}
        </ul>
      )}
    </>
  )
}

export const Navigation = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const currentSubscription = useAuthStore((state) => state.user?.subscription ?? 'FREE')

  return (
    <nav>
      <ul className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            item={item}
            isAuthenticated={isAuthenticated}
            currentSubscription={currentSubscription}
          />
        ))}
      </ul>
    </nav>
  )
}
