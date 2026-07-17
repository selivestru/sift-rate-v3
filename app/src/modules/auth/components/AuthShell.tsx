import { BlurMorphSections, BlurMorphSectionsItem } from '~/common/ui/BlurMorph'

import { AuthBrandPanel } from './AuthBrandPanel'

export const AuthShell = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      <BlurMorphSections className="relative grid min-h-dvh w-full lg:grid-cols-2">
        <BlurMorphSectionsItem className="border-border/50 bg-surface-secondary/40 relative hidden border-r lg:block">
          <AuthBrandPanel />
        </BlurMorphSectionsItem>

        <BlurMorphSectionsItem className="relative flex min-h-dvh flex-col">
          <header className="border-border/40 z-px relative flex items-center gap-2.5 border-b px-5 py-4 lg:hidden">
            <span className="bg-accent text-accent-foreground flex size-8 items-center justify-center rounded-lg text-xs font-semibold">
              C
            </span>
            <div className="min-w-0">
              <p className="text-foreground text-sm font-semibold">SiftRate</p>
              <p className="text-muted truncate text-xs">Archive media. Share reviews.</p>
            </div>
          </header>

          <main className="z-px relative flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
            <div className="bg-block border-border/60 relative w-full max-w-105 rounded-2xl border p-6 sm:p-8">
              <div
                className="-z-px pointer-events-none absolute -inset-px rounded-2xl bg-[radial-gradient(ellipse_at_50%_0%,oklch(54.09%_0.2471_299.89/0.12),transparent_70%)] opacity-80 blur-md"
                aria-hidden
              />
              {children}
            </div>
          </main>
        </BlurMorphSectionsItem>
      </BlurMorphSections>
    </div>
  )
}
