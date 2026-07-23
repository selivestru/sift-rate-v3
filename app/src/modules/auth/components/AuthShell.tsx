import { AuthBrandPanel } from './AuthBrandPanel'

export const AuthShell = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      <div className="relative grid min-h-dvh w-full lg:grid-cols-2">
        <div className="border-border bg-muted relative hidden border-r lg:block">
          <AuthBrandPanel />
        </div>

        <div className="relative flex min-h-dvh flex-col">
          <header className="border-border z-px relative flex items-center gap-2.5 border-b px-5 py-4 lg:hidden">
            <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md text-xs font-semibold">
              S
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">SiftRate</p>
              <p className="text-muted-foreground truncate text-xs">
                Archive media. Share reviews.
              </p>
            </div>
          </header>

          <main className="z-px relative flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
            <div className="bg-card border-border relative w-full max-w-105 rounded-xl border p-6 sm:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
