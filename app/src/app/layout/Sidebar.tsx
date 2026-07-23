import { Navigation } from './Navigation'

export const Sidebar = () => {
  return (
    <aside className="border-border bg-card sticky top-[calc(var(--header-height)+16px)] h-[calc(100dvh-var(--header-height)-24px)] self-start overflow-y-auto rounded-2xl border p-3 max-md:hidden">
      <div className="flex flex-col gap-1">
        <Navigation />
      </div>
    </aside>
  )
}
