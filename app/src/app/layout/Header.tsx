import { Link } from '@tanstack/react-router'
import { useIntlayer } from 'react-intlayer'

import { GoogleAuthButton, useAuthStore } from '~/modules/auth'

import { NavDrawer } from './NavDrawer'
import { Profile } from './Profile'

export const Header = () => {
  const user = useAuthStore((state) => state.user)
  const shared = useIntlayer('shared')

  return (
    <header className="border-border bg-card app-container sticky top-2 z-20 flex h-(--header-height) items-center rounded-2xl border max-md:top-0 max-md:rounded-none max-md:border-x-transparent">
      <div className="flex w-full items-center justify-between gap-3 px-4 max-md:justify-start">
        <NavDrawer />
        <div className="flex items-center gap-3 max-md:mr-auto">
          <div className="bg-primary size-10 rounded-lg" />
          <Link to="/" className="text-xl font-semibold tracking-tight">
            SiftRate
          </Link>
        </div>
        {user ? (
          <div className="flex items-center gap-3">
            <Profile />
          </div>
        ) : (
          <GoogleAuthButton size="sm" fullWidth={false} label={shared.signIn.value} />
        )}
      </div>
    </header>
  )
}
