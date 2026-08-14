import { Link } from '@tanstack/react-router'

import { Button } from '~/common/ui/Button'
import { useAuthStore } from '~/modules/auth'

import { NavDrawer } from './NavDrawer'
import { Profile } from './Profile'

export const Header = () => {
  const user = useAuthStore((state) => state.user)

  return (
    <header className="border-border bg-card app-container sticky top-2 z-20 mx-auto flex h-(--header-height) w-full items-center rounded-2xl border max-md:top-0 max-md:rounded-none max-md:border-x-transparent">
      <div className="flex w-full items-center justify-between gap-3 px-4 max-md:justify-start">
        <NavDrawer />
        <div className="flex items-center gap-3 max-md:mr-auto">
          <div className="bg-primary size-10 rounded-lg" />
          <Link to="/" className="text-xl font-semibold tracking-tight">
            SiftRate
          </Link>
        </div>
        {user ? <Profile /> : <Button render={<Link to="/auth/login">Войти</Link>} />}
      </div>
    </header>
  )
}
