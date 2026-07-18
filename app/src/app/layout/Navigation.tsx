import { Link } from '@tanstack/react-router'
import { LockIcon } from 'lucide-react'
import { m } from 'motion/react'

import { navItems, type NavItemConfig } from '~/common/constants/navigation'
import { BlurMorphSections, BlurMorphSectionsItem } from '~/common/ui/BlurMorph'
import { cn } from '~/common/utils/cn'
import { useAuthStore, type Subscription } from '~/modules/auth'

interface NavItemProps {
  item: NavItemConfig
  currentSubscription: Subscription
  indicatorId: string
  nested?: boolean
}

function NavItem({ item, currentSubscription, indicatorId, nested }: NavItemProps) {
  const isLocked = item.subscriptionRequired ? currentSubscription === 'FREE' : false

  return (
    <BlurMorphSectionsItem>
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
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <m.span
                layoutId={indicatorId}
                className="bg-primary-soft absolute inset-0 rounded-xl"
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
                className="bg-primary z-px absolute top-1/2 left-0.5 h-4 w-0.5 -translate-y-1/2 rounded-full"
                transition={{
                  type: 'spring',
                  stiffness: 380,
                  damping: 32,
                  mass: 0.8,
                }}
              />
            )}
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
              key={child.params?.mediaType ?? child.to}
              nested
              item={child}
              currentSubscription={currentSubscription}
              indicatorId={indicatorId}
            />
          ))}
        </ul>
      )}
    </BlurMorphSectionsItem>
  )
}

interface NavigationProps {
  indicatorId?: string
}

export const Navigation = ({ indicatorId = 'nav-active' }: NavigationProps) => {
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
          />
        ))}
      </BlurMorphSections>
    </nav>
  )
}
