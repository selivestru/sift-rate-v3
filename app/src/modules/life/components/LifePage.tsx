import { Link } from '@tanstack/react-router'

import { lifeChildren, lifeNav } from '~/common/constants/navigation'
import { PageHeader } from '~/common/ui/PageHeader'
import { cn } from '~/common/utils/cn'

type LifeChapterKind = 'timeline' | 'wrapped' | 'memories'

const chapterCardClass: Record<LifeChapterKind, string> = {
  timeline: 'sm:col-span-2',
  wrapped: 'sm:col-span-1',
  memories: 'sm:col-span-1',
}

const getLifeChapterKind = (to: string): LifeChapterKind => {
  const kind = to.split('/').at(-1)
  if (kind === 'timeline' || kind === 'wrapped' || kind === 'memories') return kind
  throw new Error(`Unknown life chapter route: ${to}`)
}

export const LifePage = () => {
  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6">
      <PageHeader
        icon={lifeNav.icon}
        label={lifeNav.label}
        title="Your media life story"
        description="Timeline, recaps, and memories from the films, shows, games, books, and music that shaped you."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {lifeChildren.map((chapter) => {
          const kind = getLifeChapterKind(chapter.to)

          return (
            <Link
              key={chapter.to}
              to={chapter.to}
              className={cn(
                'group border-border bg-card relative flex h-full min-h-40 flex-col overflow-hidden rounded-xl border p-5 transition-colors duration-200',
                'hover:bg-accent focus-visible:ring-ring/40 focus-visible:ring-2 focus-visible:outline-none',
                'sm:min-h-44 sm:p-6',
                chapterCardClass[kind],
              )}
            >
              <div className="relative flex flex-1 flex-col">
                <div className="flex items-center justify-between gap-3">
                  <span className="bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-lg">
                    <chapter.icon className="size-4" strokeWidth={1.75} />
                  </span>
                  {chapter.motif && (
                    <span className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
                      {chapter.motif}
                    </span>
                  )}
                </div>

                <div className="mt-auto space-y-1.5 pt-8">
                  <p
                    className={cn(
                      'font-semibold tracking-tight',
                      kind === 'timeline' ? 'text-2xl sm:text-3xl' : 'text-xl',
                    )}
                  >
                    {chapter.label}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
                    {chapter.description}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <p className="text-muted-foreground text-xs leading-relaxed">
        Life is the story. Library keeps the shelves. Discover finds the next chapter.
      </p>
    </div>
  )
}
