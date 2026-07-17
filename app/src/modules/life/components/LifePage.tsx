import { cn } from '@heroui/styles'
import { Link } from '@tanstack/react-router'
import { SparklesIcon } from 'lucide-react'

import { BlurMorphSections, BlurMorphSectionsItem } from '~/common/ui/BlurMorph'
import { useAuthStore } from '~/modules/auth'

import { lifeChapters, type LifeChapterKind } from '../constants/life-chapters'

const chapterCardClass: Record<LifeChapterKind, string> = {
  timeline: 'sm:col-span-2',
  wrapped: 'sm:col-span-1',
  memories: 'sm:col-span-1',
}

export const LifePage = () => {
  const username = useAuthStore((state) => state.user?.username)

  return (
    <div className="relative flex flex-col gap-8 overflow-hidden p-4 sm:gap-10 sm:p-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 opacity-90"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 90% 80% at 20% 0%, oklch(54% 0.18 15 / 0.18), transparent 70%), radial-gradient(ellipse 70% 60% at 90% 10%, oklch(54.09% 0.16 320 / 0.12), transparent 65%)',
        }}
      />

      <BlurMorphSections className="z-px relative flex flex-col gap-4">
        <BlurMorphSectionsItem>
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[oklch(54%_0.18_15/0.14)] text-[oklch(50%_0.16_15)] dark:text-[oklch(75%_0.12_15)]">
              <SparklesIcon className="size-4" strokeWidth={1.75} />
            </span>
            <p className="text-muted text-xs font-medium tracking-wide uppercase">Life</p>
          </div>
        </BlurMorphSectionsItem>
        <BlurMorphSectionsItem>
          <h1 className="text-foreground max-w-lg text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Your media life
          </h1>
        </BlurMorphSectionsItem>
        <BlurMorphSectionsItem>
          <p className="text-muted max-w-md text-sm leading-relaxed text-pretty sm:text-base">
            {username
              ? `A warm record of the films, shows, games, books, and music that shaped ${username}.`
              : 'A warm record of the media that shaped you.'}
          </p>
        </BlurMorphSectionsItem>
      </BlurMorphSections>

      <BlurMorphSections className="z-px relative grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {lifeChapters.map((chapter) => (
          <BlurMorphSectionsItem key={chapter.to} className={chapterCardClass[chapter.kind]}>
            <Link
              to={chapter.to}
              className={cn(
                'group border-border/50 bg-surface/50 relative flex h-full min-h-40 flex-col overflow-hidden rounded-3xl border p-5 transition-colors duration-300',
                'hover:border-border hover:bg-surface focus-visible:ring-accent/40 focus-visible:ring-2 focus-visible:outline-none',
                'sm:min-h-44 sm:p-6',
              )}
            >
              {chapter.kind === 'timeline' && (
                <div className="pointer-events-none absolute top-5 bottom-5 left-5 flex w-3 flex-col items-center sm:left-6">
                  <span className="size-2.5 rounded-full bg-rose-400/80" />
                  <span className="w-px flex-1 bg-linear-to-b from-rose-400/70 via-rose-400/30 to-transparent" />
                  <span className="size-1.5 rounded-full bg-rose-400/40" />
                </div>
              )}

              {chapter.kind === 'wrapped' && (
                <div
                  className="pointer-events-none absolute -top-8 -right-6 size-28 rounded-full opacity-50 blur-2xl"
                  style={{
                    background:
                      'radial-gradient(circle, oklch(60% 0.18 320 / 0.5), transparent 70%)',
                  }}
                  aria-hidden
                />
              )}

              {chapter.kind === 'memories' && (
                <div
                  className="pointer-events-none absolute top-4 right-4 size-14 rounded-2xl border border-dashed border-rose-400/20 opacity-70"
                  aria-hidden
                />
              )}

              <div
                className={cn(
                  'relative z-px flex flex-1 flex-col',
                  chapter.kind === 'timeline' && 'pl-7 sm:pl-8',
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-300">
                    <chapter.icon className="size-4" strokeWidth={1.75} />
                  </span>
                  <span className="text-muted text-[11px] font-medium tracking-wide uppercase">
                    {chapter.motif}
                  </span>
                </div>

                <div className="mt-auto space-y-1.5 pt-8">
                  <p
                    className={cn(
                      'text-foreground font-semibold tracking-tight',
                      chapter.kind === 'timeline' ? 'text-2xl sm:text-3xl' : 'text-xl',
                    )}
                  >
                    {chapter.label}
                  </p>
                  <p className="text-muted text-sm leading-relaxed text-pretty">
                    {chapter.description}
                  </p>
                </div>
              </div>
            </Link>
          </BlurMorphSectionsItem>
        ))}
      </BlurMorphSections>

      <BlurMorphSections className="z-px relative">
        <BlurMorphSectionsItem>
          <p className="text-muted text-xs leading-relaxed">
            Life is the story. Library keeps the shelves. Discover finds the next chapter.
          </p>
        </BlurMorphSectionsItem>
      </BlurMorphSections>
    </div>
  )
}
