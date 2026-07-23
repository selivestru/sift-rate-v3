import { Link } from '@tanstack/react-router'
import { Check, Logout, Settings } from 'reicon-react'

import { useTheme } from '~/common/theme'
import { Avatar, AvatarFallback, AvatarImage } from '~/common/ui/Avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/common/ui/DropdownMenu'
import { getFirstLetter } from '~/common/utils/getFirstLetter'
import { useAuthStore } from '~/modules/auth'
import { useLogout } from '~/modules/auth/hooks/useLogout'

export const Profile = () => {
  const user = useAuthStore((state) => state.user!)
  const { logout } = useLogout()
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        nativeButton={false}
        render={
          <Avatar size="lg">
            <AvatarImage src={user.avatarUrl!} alt={user.username!} />
            <AvatarFallback>{getFirstLetter(user.username!)}</AvatarFallback>
          </Avatar>
        }
      />
      <DropdownMenuContent align="end" className="w-fit">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link
              to="/$username"
              params={{ username: user.username! }}
              className="flex items-center gap-2"
            >
              <Avatar>
                <AvatarImage src={user.avatarUrl!} alt={user.username!} />
                <AvatarFallback>{getFirstLetter(user.username!)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0">
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-muted-foreground text-xs">{user.email}</p>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuItem
            closeOnClick={false}
            className="justify-between"
            onClick={() => setTheme('system')}
          >
            System
            {theme === 'system' && <Check />}
          </DropdownMenuItem>
          <DropdownMenuItem
            closeOnClick={false}
            className="justify-between"
            onClick={() => setTheme('light')}
          >
            Light
            {theme === 'light' && <Check />}
          </DropdownMenuItem>
          <DropdownMenuItem
            closeOnClick={false}
            className="justify-between"
            onClick={() => setTheme('dark')}
          >
            Dark
            {theme === 'dark' && <Check />}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-between">
            Settings
            <Settings />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" className="justify-between" onClick={logout}>
            Log Out
            <Logout />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
