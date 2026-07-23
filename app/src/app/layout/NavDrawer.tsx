import { useLocation } from '@tanstack/react-router'
import { Menu } from 'reicon-react'

import { Button } from '~/common/ui/Button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '~/common/ui/Drawer'
import { SettingsBackLink, SettingsNav } from '~/modules/settings'

import { Navigation } from './Navigation'

export const NavDrawer = () => {
  const pathname = useLocation({ select: (location) => location.pathname })
  const isSettings = pathname.startsWith('/settings')

  return (
    <Drawer>
      <DrawerTrigger
        render={
          <Button
            isIconOnly
            variant="secondary"
            aria-label="Open menu"
            className="hidden max-md:flex"
          >
            <Menu />
          </Button>
        }
      >
        <Menu />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{isSettings ? 'Settings' : 'Menu'}</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-1 p-4">
          {isSettings ? (
            <>
              <SettingsBackLink />
              <div className="bg-border my-2 h-px w-full" />
              <SettingsNav />
            </>
          ) : (
            <Navigation />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
