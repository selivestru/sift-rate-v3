import { cn } from '@heroui/styles'
import { Link } from '@tanstack/react-router'
import { LockIcon } from 'lucide-react'
import { m } from 'motion/react'

import { navItems, type NavItemConfig } from '~/common/constants/navigation'
import { BlurMorphSections, BlurMorphSectionsItem } from '~/common/ui/BlurMorph'
import { useAuthStore, type Subscription } from '~/modules/auth'

interface NavItemProps {
  item: NavItemConfig
  currentSubscription: Subscription
  indicatorId: string
  nested?: boolean
  onNavigate?: () => void
}

function NavItem({ item, currentSubscription, indicatorId, nested, onNavigate }: NavItemProps) {
  const isLocked = item.subscriptionRequired ? currentSubscription === 'FREE' : false

  return (
    <BlurMorphSectionsItem>
      <Link
        to={item.to}
        params={item.params}
        onClick={onNavigate}
        disabled={isLocked}
        activeOptions={{ exact: true, includeSearch: false }}
        className={cn(
          'text-muted relative flex items-center gap-2.5 rounded-xl px-3 text-sm font-medium transition-colors duration-300',
          'focus-visible:ring-sidebar-ring/40 focus-visible:ring-offset-sidebar focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          nested ? 'text-muted/80 h-9' : 'h-10',
          isLocked
            ? 'cursor-not-allowed opacity-50'
            : 'hover:bg-accent-soft/40 hover:text-sidebar-accent-foreground',
        )}
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <m.span
                layoutId={indicatorId}
                className="bg-accent-soft absolute inset-0 rounded-xl"
                transition={{
                  type: 'spring',
                  stiffness: 380,
                  damping: 32,
                  mass: 0.8,
                }}
              />
            )}
            {isActive && (
              <m.span
                layoutId={`${indicatorId}-bar`}
                className="bg-accent absolute top-1/2 left-0.5 z-10 h-4 w-0.5 -translate-y-1/2 rounded-full"
                transition={{
                  type: 'spring',
                  stiffness: 380,
                  damping: 32,
                  mass: 0.8,
                }}
              />
            )}
            <item.icon
              className={cn(
                'relative z-10 size-5 shrink-0',
                nested && 'size-4',
                isActive && 'text-foreground',
              )}
            />
            <span className={cn('relative z-10 flex-1', isActive && 'text-foreground')}>
              {item.label}
            </span>
            {isLocked && <LockIcon className="relative z-10 size-4 shrink-0 opacity-70" />}
          </>
        )}
      </Link>

      {item.children && (
        <ul className="border-sidebar-border/60 mt-1 ml-5 flex flex-col gap-0.5 border-l pl-2">
          {item.children.map((child) => (
            <NavItem
              key={child.params?.mediaType ?? child.to}
              nested
              item={child}
              currentSubscription={currentSubscription}
              indicatorId={indicatorId}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </BlurMorphSectionsItem>
  )
}

interface NavigationProps {
  onNavigate?: () => void
  indicatorId?: string
}

export const Navigation = ({ onNavigate, indicatorId = 'nav-active' }: NavigationProps) => {
  const currentSubscription = useAuthStore((state) => state.user?.subscription ?? 'FREE')

  return (
    <nav>
      <BlurMorphSections className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            item={item}
            currentSubscription={currentSubscription}
            indicatorId={indicatorId}
            onNavigate={onNavigate}
          />
        ))}
      </BlurMorphSections>
    </nav>
  )
}
