import { useLocation } from '@tanstack/react-router'

import { SettingsBackLink, SettingsNav } from '~/modules/settings'

import { Navigation } from './Navigation'

export const Sidebar = () => {
  const pathname = useLocation({ select: (location) => location.pathname })
  const isSettings = pathname.startsWith('/settings')

  return (
    <aside className="border-border bg-card sticky top-[calc(var(--header-height)+16px)] h-[calc(100dvh-var(--header-height)-24px)] self-start overflow-y-auto rounded-2xl border p-3 max-md:hidden">
      <div className="flex flex-col gap-1">
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
    </aside>
  )
}
