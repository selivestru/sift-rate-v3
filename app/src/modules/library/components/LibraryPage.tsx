import { Link } from '@tanstack/react-router'
import { ChevronRightIcon, LibraryIcon } from 'lucide-react'

import { cn } from '~/common/utils/cn'

import { librarySections } from '../constants/library-sections'

export const LibraryPage = () => {
  return (
    <div className="relative flex flex-col gap-6 overflow-hidden p-4 sm:gap-8 sm:p-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 opacity-90"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 90% 80% at 20% 0%, oklch(54.09% 0.2 299.89 / 0.18), transparent 70%), radial-gradient(ellipse 70% 60% at 90% 10%, oklch(54.09% 0.14 280 / 0.12), transparent 65%)',
        }}
      />

      <div className="z-px relative flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <span className="bg-primary/12 text-primary flex size-9 items-center justify-center rounded-xl">
            <LibraryIcon className="size-4" strokeWidth={1.75} />
          </span>
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Library
          </p>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Your collection</h1>
        <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
          Personal archive tools. Ordered, private, yours.
        </p>
      </div>

      <div className="border-border/80 z-px divide-border relative divide-y overflow-hidden rounded-2xl border">
        {librarySections.map((section) => (
          <Link
            key={section.to}
            to={section.to}
            style={{
              '--media-color': section.color,
            }}
            className={cn(
              'group bg-surface/40 hover:bg-(--media-color)/5 flex items-center gap-4 px-4 py-4 transition-colors duration-200 sm:gap-5 sm:px-5 sm:py-5',
              'focus-visible:ring-primary/40 focus-visible:bg-(--media-color)/5 focus-visible:ring-2 focus-visible:outline-none',
            )}
          >
            <span className="text-muted-foreground/70 w-7 shrink-0 font-mono text-xs tabular-nums">
              {section.index}
            </span>

            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-black/5 dark:border-white/10"
              style={{
                color: section.color,
                backgroundColor: `${section.color}14`,
              }}
            >
              <section.icon className="size-5" strokeWidth={1.75} />
            </span>

            <div className="min-w-0 flex-1 space-y-0.5">
              <p className="text-sm font-semibold tracking-tight sm:text-base">{section.label}</p>
              <p className="text-muted-foreground truncate text-sm leading-relaxed">
                {section.description}
              </p>
            </div>

            <ChevronRightIcon className="text-muted-foreground group-hover:text-foreground size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>

      <p className="text-muted-foreground text-xs leading-relaxed">
        Looking for something new? Head to Discover. Life holds the story behind the shelf.
      </p>
    </div>
  )
}
