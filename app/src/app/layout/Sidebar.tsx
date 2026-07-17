import { BlurMorphSections } from '~/common/ui/BlurMorph'

import { Navigation } from './Navigation'

export const Sidebar = () => {
  return (
    <aside className="border-sidebar-border bg-block/50 sticky top-[calc(var(--header-height)+16px)] h-[calc(100dvh-var(--header-height)-24px)] self-start overflow-y-auto rounded-3xl border p-3 backdrop-blur-2xl max-md:hidden">
      <BlurMorphSections className="flex flex-col gap-1">
        <Navigation indicatorId="nav-sidebar" />
      </BlurMorphSections>
    </aside>
  )
}
