import { Link } from '@tanstack/react-router'

import { NavDrawer } from './NavDrawer'
import { Profile } from './Profile'

export const Header = () => {
  return (
    <header className="border-border bg-block sticky top-2 z-50 mx-auto flex h-(--header-height) w-full max-w-5xl items-center rounded-3xl border max-md:top-0 max-md:rounded-none max-md:border-r-transparent max-md:border-l-transparent">
      <div className="flex w-full items-center justify-between gap-3 px-4 max-md:justify-start">
        <NavDrawer />
        <div className="flex items-center gap-3 max-md:mr-auto">
          <div className="bg-accent size-12 rounded-xl" />
          <Link to="/" className="text-xl font-bold">
            sifrate
          </Link>
        </div>

        <Profile />
      </div>
    </header>
  )
}
