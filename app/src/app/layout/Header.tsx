import { Link } from '@tanstack/react-router'

import { Button } from '~/common/ui/Button'
import { useAuthStore } from '~/modules/auth'

import { NavDrawer } from './NavDrawer'
import { Profile } from './Profile'

export const Header = () => {
  const user = useAuthStore((state) => state.user!)

  return (
    <header className="border-border bg-container sticky top-2 z-10 mx-auto flex h-(--header-height) w-full max-w-5xl items-center rounded-3xl border backdrop-blur-2xl max-md:top-0 max-md:rounded-none max-md:border-r-transparent max-md:border-l-transparent">
      <div className="flex w-full items-center justify-between gap-3 px-4 max-md:justify-start">
        <NavDrawer />
        <div className="flex items-center gap-3 max-md:mr-auto">
          <div className="bg-primary size-12 rounded-xl" />
          <Link to="/" className="text-xl font-bold">
            SiftRate
          </Link>
        </div>
        {user ? <Profile /> : <Button render={<Link to="/auth/login">Войти</Link>} />}
      </div>
    </header>
  )
}
