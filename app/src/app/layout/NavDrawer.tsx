import { useLocation } from '@tanstack/react-router'
import { useState } from 'react'
import { useIntlayer } from 'react-intlayer'
import { Menu } from 'reicon-react'

import { Button } from '~/common/ui/Button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '~/common/ui/Drawer'
import { SettingsBackLink, SettingsNav } from '~/modules/settings'

import { Navigation } from './Navigation'

export const NavDrawer = () => {
  const pathname = useLocation({ select: (location) => location.pathname })
  const isSettings = pathname.startsWith('/settings')
  const shared = useIntlayer('shared')
  const [open, setOpen] = useState(false)

  const closeOnNavigate = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('a')) {
      setOpen(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        render={
          <Button
            isIconOnly
            variant="secondary"
            aria-label={shared.openMenu.value}
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
          <DrawerTitle>{isSettings ? shared.settings : shared.menu}</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-1 p-4" onClick={closeOnNavigate}>
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
