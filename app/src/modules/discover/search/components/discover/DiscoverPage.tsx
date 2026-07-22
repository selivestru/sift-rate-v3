import { Link } from '@tanstack/react-router'
import { ChevronRight, Compass } from 'reicon-react'

import { mediaTypeMeta } from '~/common/constants/media-type'
import { cn } from '~/common/utils/cn'

import { mediaTypeDestinations } from '../../constants/media-types'

export const DiscoverPage = () => {
  return (
    <div className="relative flex flex-col gap-6 overflow-hidden p-4 sm:gap-8 sm:p-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 opacity-90"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 90% 80% at 18% 0%, oklch(58% 0.11 165 / 0.18), transparent 70%), radial-gradient(ellipse 70% 55% at 92% 8%, oklch(62% 0.06 190 / 0.1), transparent 65%)',
        }}
      />

      <div className="z-px relative flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[oklch(58%_0.11_165/0.14)] text-[oklch(42%_0.1_165)] dark:text-[oklch(78%_0.09_165)]">
            <Compass className="size-4" strokeWidth={1.75} />
          </span>
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Discover
          </p>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          Explore the catalog
        </h1>
        <p className="text-muted-foreground max-w-md text-sm leading-relaxed text-pretty">
          Pick a medium and start searching. Six doors into one endless library.
        </p>
      </div>

      <div className="z-px relative grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3">
        {mediaTypeDestinations.map((item) => {
          const meta = mediaTypeMeta[item.type]
          const Icon = meta.icon
          const to = `/discover/${item.mediaTypeSlug}`

          return (
            <Link
              key={item.mediaTypeSlug}
              to={to}
              style={{ '--media-color': meta.color }}
              className={cn(
                'group border-border/50 relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-4 sm:p-5 bg-surface/50',
                'transition-all duration-300 ease-out',
                'hover:-translate-y-0.5 hover:border-(--media-color)/50 hover:bg-(--media-color)/5',
                'active:translate-y-0 active:scale-[0.99]',
                'focus-visible:ring-primary/40 focus-visible:z-px focus-visible:ring-2 focus-visible:outline-none',
              )}
            >
              <div className="z-px relative flex items-start justify-between gap-3">
                <span
                  className="flex size-10 items-center justify-center rounded-xl"
                  style={{
                    color: meta.color,
                    backgroundColor: `color-mix(in oklab, ${meta.color} 14%, transparent)`,
                  }}
                >
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <ChevronRight
                  className="text-muted-foreground size-4 shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-(--media-color)"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </div>

              <div className="z-px relative mt-8 space-y-1">
                <p className="text-lg font-semibold tracking-tight">{meta.label}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="z-px relative">
        <p className="text-muted-foreground border-border/60 border-t pt-4 text-xs leading-relaxed">
          Discover is for finding something new. Your ratings and lists live in Library.
        </p>
      </div>
    </div>
  )
}
