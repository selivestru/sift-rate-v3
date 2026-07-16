import { cn } from '@heroui/styles'
import { Link } from '@tanstack/react-router'
import { LockIcon } from 'lucide-react'

import { navItems, type NavItemConfig } from '~/common/constants/navigation'
import { BlurMorphSections, BlurMorphSectionsItem } from '~/common/ui/BlurMorph'

interface NavItemProps {
  item: NavItemConfig
  nested?: boolean
  currentSubscription?: any // TODO: Subscription
  onNavigate?: () => void
}

function NavItem({ item, nested, currentSubscription, onNavigate }: NavItemProps) {
  const isLocked = item.subscriptionRequired ? currentSubscription === 'FREE' : false

  return (
    <BlurMorphSectionsItem key={item.to}>
      <Link
        to={item.to}
        onClick={onNavigate}
        disabled={isLocked}
        activeOptions={{ exact: true }}
        className={cn(
          'text-muted relative flex items-center gap-2.5 rounded-xl px-3 text-sm font-medium transition-colors',
          'focus-visible:ring-sidebar-ring/40 focus-visible:ring-offset-sidebar focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          nested ? 'text-muted/80 h-9' : 'h-10',
          isLocked
            ? 'cursor-not-allowed opacity-50'
            : 'hover:bg-accent-soft-hover hover:text-sidebar-accent-foreground',
        )}
        activeProps={{
          className: 'bg-accent-soft text-foreground! hover:bg-accent-soft-hover!',
        }}
      >
        {({ isActive }) => (
          <>
            <span
              className={cn(
                'bg-accent absolute top-1/2 left-0.5 h-4 w-0.5 -translate-y-1/2 rounded-full transition-all',
                isActive ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0',
              )}
            />
            <item.icon className={cn('size-5 shrink-0', nested && 'size-4')} />
            <span className="flex-1">{item.label}</span>
            {isLocked && <LockIcon className="size-4 shrink-0 opacity-70" />}
          </>
        )}
      </Link>

      {item.children && (
        <ul className="border-sidebar-border/60 mt-1 ml-5 flex flex-col gap-0.5 border-l pl-2">
          {item.children.map((child) => (
            <NavItem key={child.to} nested item={child} currentSubscription={currentSubscription} />
          ))}
        </ul>
      )}
    </BlurMorphSectionsItem>
  )
}

interface NavigationProps {
  onNavigate?: () => void
}

export const Navigation = ({ onNavigate }: NavigationProps) => {
  const currentSubscription = 'FREE'

  return (
    <nav>
      <BlurMorphSections className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            item={item}
            currentSubscription={currentSubscription}
            onNavigate={onNavigate}
          />
        ))}
      </BlurMorphSections>
    </nav>
  )
}
