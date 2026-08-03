import { Link } from '@tanstack/react-router'

import { navItems, type NavItemConfig } from '~/common/constants/navigation'
import { cn } from '~/common/utils/cn'
import { useAuthStore, type User } from '~/modules/auth'

interface NavItemProps {
  item: NavItemConfig
  user: User | null
  nested?: boolean
}

function NavItem({ item, user, nested }: NavItemProps) {
  if (item.show && !item.show(user)) return null

  const children = item.children?.filter((child) => !child.show || child.show(user))

  return (
    <>
      <Link
        to={item.to}
        params={item.params}
        activeOptions={{ exact: true, includeSearch: false }}
        className={cn(
          'text-muted-foreground relative flex items-center gap-2.5 rounded-md px-3 text-sm font-medium',
          'focus-visible:ring-ring/40 focus-visible:ring-2 focus-visible:outline-none',
          nested ? 'h-9' : 'h-10',
          'hover:bg-accent hover:text-accent-foreground',
        )}
        activeProps={{
          className: 'bg-accent text-accent-foreground hover:bg-accent',
        }}
      >
        {({ isActive }) => (
          <>
            <item.icon
              className={cn(
                'size-5 shrink-0',
                nested && 'size-4',
                isActive && 'text-accent-foreground',
              )}
            />
            <span className={cn('flex-1', isActive && 'text-accent-foreground')}>{item.label}</span>
          </>
        )}
      </Link>

      {children && children.length > 0 && (
        <ul className="border-border mt-1 ml-5 flex flex-col gap-0.5 border-l pl-2">
          {children.map((child) => (
            <NavItem nested key={child.params?.mediaType ?? child.to} item={child} user={user} />
          ))}
        </ul>
      )}
    </>
  )
}

export const Navigation = () => {
  const user = useAuthStore((state) => state.user)

  const visibleItems = navItems.filter((item) => !item.show || item.show(user))

  return (
    <nav>
      <ul className="flex flex-col gap-1">
        {visibleItems.map((item) => (
          <NavItem key={item.to} item={item} user={user} />
        ))}
      </ul>
    </nav>
  )
}
